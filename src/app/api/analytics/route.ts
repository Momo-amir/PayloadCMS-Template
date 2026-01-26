import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 100
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
let lastCleanup = Date.now()

// Cleanup old rate limit entries (runs on each request, max once per minute)
function cleanupRateLimitMap() {
  const now = Date.now()
  // Only cleanup if more than 1 minute has passed since last cleanup
  if (now - lastCleanup < 60000) return

  lastCleanup = now
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip)
    }
  }

  // Log memory stats in dev
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Rate limit map size: ${rateLimitMap.size} entries`)
  }
}

// Analytics config type
type AnalyticsConfig = {
  enabled?: boolean | null
  store_aggregates?: boolean | null
  ga4_enabled?: boolean | null
  matomo_enabled?: boolean | null
  anonymize_ip?: boolean | null
}

// Cache analytics config (changes rarely)
let cachedConfig: AnalyticsConfig | null = null
let configCacheTime = 0
const CONFIG_CACHE_TTL = 60000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) return false
  record.count++
  return true
}

function getCountryFromIP(_ip: string): string {
  // TODO: Add geolocation lookup if needed (e.g., @vercel/edge or maxmind)
  return 'unknown'
}

function normalizeURL(url: string): string {
  try {
    const parsed = new URL(url, 'http://dummy.com')
    let path = parsed.pathname

    // Remove query strings (may contain PII)
    // Replace numeric IDs with [id]
    path = path.replace(/\/\d+/g, '/[id]')
    // Replace UUIDs with [uuid]
    path = path.replace(/\/[a-f0-9-]{36}/g, '/[uuid]')

    return path
  } catch {
    return url
  }
}

function sanitizeEventData(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') return {}

  // Remove PII fields
  const piiFields = ['email', 'phone', 'name', 'address', 'ip', 'user_id', 'customer_id']
  const sanitized: Record<string, unknown> = { ...data } as Record<string, unknown>

  piiFields.forEach((field) => {
    if (field in sanitized) delete sanitized[field]
  })

  // Recursively sanitize nested objects
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeEventData(sanitized[key])
    }
  })

  return sanitized
}

export async function POST(request: NextRequest) {
  try {
    // Lazy cleanup of rate limit map
    cleanupRateLimitMap()

    const payload = await getPayload({ config })

    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIP || 'unknown'

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Get consent token from cookie
    const cookieStore = await cookies()
    const consentToken = cookieStore.get('consent_token')?.value

    if (!consentToken) {
      return NextResponse.json({ error: 'No consent token found' }, { status: 403 })
    }

    // FIRST: Check consent in database
    const consentRecord = await payload.find({
      collection: 'consent-tokens',
      where: { token: { equals: consentToken } },
      limit: 1,
    })

    if (!consentRecord.docs.length || !consentRecord.docs[0]?.analytics) {
      // User hasn't consented - reject immediately
      return NextResponse.json({ error: 'Analytics consent not given' }, { status: 403 })
    }

    // NOW we can process the event
    const body = await request.json()
    const { events } = body

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 })
    }

    // Get analytics config with caching
    const now = Date.now()
    if (!cachedConfig || now - configCacheTime > CONFIG_CACHE_TTL) {
      cachedConfig = await payload.findGlobal({ slug: 'analytics-config' })
      configCacheTime = now
    }
    const analyticsConfig = cachedConfig

    if (!analyticsConfig?.enabled) {
      return NextResponse.json({ success: true }) // Silently accept but don't process
    }

    const country = analyticsConfig?.anonymize_ip ? getCountryFromIP(ip) : null
    const today = new Date().toISOString().split('T')[0]! // YYYY-MM-DD (always defined)

    // Queue each event using Payload's native job system
    // Jobs will be processed by autoRun cron (every 5 minutes)
    for (const event of events) {
      if (!event || !event.event_name) continue // Skip invalid events

      const normalizedPath = normalizeURL(event.page_path || '')
      const sanitizedData = sanitizeEventData(event.event_data || {})

      // Queue workflow job (includes aggregation + GA4 + Matomo)
      await payload.jobs.queue({
        workflow: 'processAnalyticsEvent',
        input: {
          event_name: event.event_name,
          page_path: normalizedPath,
          event_data: sanitizedData,
          country: country || 'unknown',
          date: today,
          consent_token: consentToken,
          store_aggregates: analyticsConfig?.store_aggregates || false,
          ga4_enabled: analyticsConfig?.ga4_enabled || false,
          matomo_enabled: analyticsConfig?.matomo_enabled || false,
        },
      })
    }

    // Return immediately (jobs process async via cron)
    return NextResponse.json({ success: true, queued: events.length }, { status: 201 })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
