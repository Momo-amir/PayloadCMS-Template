import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { ANALYTICS_ALLOWED_KEYS, validateAllowlist } from '@/cms/utilities/analytics-allowlist'
import { isTrustedOrigin } from '@/cms/utilities/isTrustedOrigin'
import { CONSENT_POLICY_VERSION } from '@/cms/utilities/consent-model'

type RateLimitRecord = {
  count: number
  resetAt: number
}

validateAllowlist()

// Simple in-memory rate limiting (per consent token + per IP)
const tokenRateLimitMap = new Map<string, RateLimitRecord>()
const ipRateLimitMap = new Map<string, RateLimitRecord>()

const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute window
const RATE_LIMIT_TOKENS_MAX_EVENTS = 600 // total events/min per consent token
const RATE_LIMIT_IP_MAX_EVENTS = 3_000 // total events/min per IP

// Cleanup throttles (per map)
let lastTokenCleanup = 0
let lastIpCleanup = 0

function keyNameForMap(map: Map<string, RateLimitRecord>): string {
  if (map === tokenRateLimitMap) return 'tokens'
  if (map === ipRateLimitMap) return 'ips'
  return 'unknown'
}

// Cleanup old rate limit entries (runs on each request, max once per minute)
function cleanupRateLimitMap(map: Map<string, RateLimitRecord>) {
  const now = Date.now()
  const lastCleanup = map === tokenRateLimitMap ? lastTokenCleanup : lastIpCleanup

  // Only cleanup if more than 1 minute has passed since last cleanup
  if (now - lastCleanup < 60_000) return

  if (map === tokenRateLimitMap) lastTokenCleanup = now
  else lastIpCleanup = now

  for (const [key, record] of map.entries()) {
    if (now > record.resetAt) {
      map.delete(key)
    }
  }

  // Log memory stats in dev
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Rate limit map size (${keyNameForMap(map)}): ${map.size} entries`)
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

function checkRateLimit(
  map: Map<string, RateLimitRecord>,
  key: string,
  increment: number,
  maxEventsPerWindow: number,
): boolean {
  const now = Date.now()
  const safeIncrement = increment > 0 ? increment : 1
  const existing = map.get(key)

  if (!existing || now > existing.resetAt) {
    map.set(key, {
      count: safeIncrement,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return safeIncrement <= maxEventsPerWindow
  }

  const newCount = existing.count + safeIncrement
  if (newCount > maxEventsPerWindow) {
    existing.count = newCount
    return false
  }

  existing.count = newCount
  return true
}

function getCountryFromRequest(request: NextRequest): string {
  const raw =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    request.headers.get('fastly-geo-country') ||
    request.headers.get('x-geo-country')

  if (!raw) return 'unknown'

  const value = raw.trim().toUpperCase()
  if (!value || value === 'UNKNOWN' || value === 'XX') return 'unknown'

  return value
}

function normalizeURL(url: string): string {
  try {
    const parsed = new URL(url, 'http://dummy.com')
    let path = parsed.pathname

    path = path.replace(/\/\d+(\b|\/)/g, '/[id]$1')
    path = path.replace(/\/[a-f0-9-]{36}(\b|\/)/gi, '/[uuid]$1')
    path = path.replace(/\/[a-f0-9]{16,}(\b|\/)/gi, '/[hash]$1')

    return path
  } catch {
    return url
  }
}

const MAX_BODY_BYTES = 64 * 1024 // 64 KB
const MAX_EVENTS = 25
const MAX_EVENT_NAME_LENGTH = 64
const MAX_EVENT_DATA_BYTES = 8 * 1024 // 8 KB per event_data
const QUEUE_CONCURRENCY = 5

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length
}

function sanitizeUrlLike(value: string, key: string, host?: string | null): string {
  try {
    const isAbsolute = value.startsWith('http://') || value.startsWith('https://')
    const base = isAbsolute ? undefined : host ? `https://${host}` : 'http://dummy.com'
    const parsed = new URL(value, base)
    const normalizedPath = normalizeURL(parsed.pathname)

    const keyLower = key.toLowerCase()
    if (keyLower.includes('referrer') || keyLower.includes('referral')) {
      return isAbsolute ? parsed.origin : normalizedPath
    }

    if (keyLower.includes('url') || keyLower.includes('path') || keyLower.includes('page')) {
      return isAbsolute ? `${parsed.origin}${normalizedPath}` : normalizedPath
    }

    return value
  } catch {
    return value
  }
}

function sanitizeEventData(
  data: unknown,
  host?: string | null,
): Record<string, unknown> | unknown[] {
  if (!data || typeof data !== 'object') return {}

  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
  const phonePattern =
    /(\+?\d[\d\s().-]{7,}\d)/g

  const piiFields = [
    'email',
    'phone',
    'address',
    'ip',
    'user_id',
    'userid',
    'customer_id',
    'customerid',
    'first_name',
    'last_name',
    'full_name',
  ]
  const piiSet = new Set(piiFields)

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeEventData(item, host)) as unknown[]
  }

  const sanitized: Record<string, unknown> = {}
  const original = data as Record<string, unknown>

  Object.entries(original).forEach(([key, value]) => {
    const keyLower = key.toLowerCase()
    if (piiSet.has(keyLower)) {
      return
    }

    if (!ANALYTICS_ALLOWED_KEYS.has(keyLower) && !keyLower.startsWith('utm_')) {
      return
    }

    if (typeof value === 'string') {
      let nextValue = value
      if (emailPattern.test(nextValue) || phonePattern.test(nextValue)) {
        return
      }
      nextValue = sanitizeUrlLike(nextValue, key, host)
      if (emailPattern.test(nextValue) || phonePattern.test(nextValue)) {
        return
      }
      sanitized[key] = nextValue
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeEventData(value, host)
    } else {
      sanitized[key] = value
    }
  })

  return sanitized
}

export async function POST(request: NextRequest) {
  try {
    // Lazy cleanup of rate limit maps
    cleanupRateLimitMap(tokenRateLimitMap)
    cleanupRateLimitMap(ipRateLimitMap)

    const payload = await getPayload({ config })

    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIP || 'unknown'

    // Get consent token from cookie
    const cookieStore = await cookies()
    const consentToken = cookieStore.get('consent_token')?.value

    if (!consentToken) {
      return NextResponse.json({ error: 'No consent token found' }, { status: 403 })
    }

    if (!isTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Untrusted origin' }, { status: 403 })
    }

    // 1) Check consent in database
    const consentRecord = await payload.find({
      collection: 'consent-tokens',
      where: { token: { equals: consentToken } },
      limit: 1,
      overrideAccess: true,
    })

    if (!consentRecord.docs.length || !consentRecord.docs[0]?.analytics) {
      // User hasn't consented - reject immediately
      return NextResponse.json({ error: 'Analytics consent not given' }, { status: 403 })
    }
    const consent = consentRecord.docs[0] as {
      analyticsLocalStorage?: boolean | null
      analyticsThirdPartySharing?: boolean | null
      version?: number | null
    }
    const consentVersion = consent.version ?? 1
    if (consentVersion !== CONSENT_POLICY_VERSION) {
      return NextResponse.json({ error: 'Consent version is outdated' }, { status: 403 })
    }

    const rawBody = await request.text()
    if (byteLength(rawBody) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
    }

    if (!rawBody) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 })
    }

    let body: { events?: unknown }
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { events } = body

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 })
    }

    if (events.length > MAX_EVENTS) {
      return NextResponse.json({ error: 'Too many events in one request' }, { status: 413 })
    }

    // Rate limiting (apply both per-token and per-IP budgets)
    const tokenAllowed = checkRateLimit(
      tokenRateLimitMap,
      consentToken,
      events.length,
      RATE_LIMIT_TOKENS_MAX_EVENTS,
    )
    const ipAllowed = checkRateLimit(ipRateLimitMap, ip, events.length, RATE_LIMIT_IP_MAX_EVENTS)
    if (!tokenAllowed || !ipAllowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
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

    const country = analyticsConfig?.anonymize_ip ? getCountryFromRequest(request) : null
    const today = new Date().toISOString().split('T')[0]! // YYYY-MM-DD (always defined)
    const host = request.headers.get('host')

    const jobInputs: Array<{
      event_name: string
      page_path: string
      event_data: Record<string, unknown> | unknown[]
      country: string
      date: string
      consent_token: string
      store_aggregates: boolean
      ga4_enabled: boolean
      matomo_enabled: boolean
    }> = []

    for (const event of events) {
      if (!event || typeof event !== 'object') continue
      const eventRecord = event as {
        event_name?: unknown
        page_path?: unknown
        event_data?: unknown
      }

      if (typeof eventRecord.event_name !== 'string') continue
      if (
        eventRecord.event_name.length === 0 ||
        eventRecord.event_name.length > MAX_EVENT_NAME_LENGTH
      ) {
        continue
      }

      const pagePath = typeof eventRecord.page_path === 'string' ? eventRecord.page_path : ''
      const normalizedPath = normalizeURL(pagePath)
      const sanitizedData = sanitizeEventData(eventRecord.event_data || {}, host)
      let finalEventData = sanitizedData
      try {
        const sanitizedDataBytes = byteLength(JSON.stringify(sanitizedData))
        if (sanitizedDataBytes > MAX_EVENT_DATA_BYTES) {
          finalEventData = {}
        }
      } catch {
        finalEventData = {}
      }

      const storeAggregates =
        (analyticsConfig?.store_aggregates || false) && (consent.analyticsLocalStorage ?? true)
      const ga4Enabled =
        (analyticsConfig?.ga4_enabled || false) && (consent.analyticsThirdPartySharing ?? false)
      const matomoEnabled =
        (analyticsConfig?.matomo_enabled || false) &&
        (consent.analyticsThirdPartySharing ?? false)

      // Valid consent exists, but this project/user combination disables all sinks.
      // Accept the request and skip queueing side-effect-free jobs.
      if (!storeAggregates && !ga4Enabled && !matomoEnabled) {
        continue
      }

      jobInputs.push({
        event_name: eventRecord.event_name,
        page_path: normalizedPath,
        event_data: finalEventData,
        country: country || 'unknown',
        date: today,
        consent_token: consentToken,
        store_aggregates: storeAggregates,
        ga4_enabled: ga4Enabled,
        matomo_enabled: matomoEnabled,
      })
    }

    // Queue each event using bounded parallel batches.
    // Jobs will be processed by autoRun cron (every 5 minutes)
    let queuedCount = 0
    for (let index = 0; index < jobInputs.length; index += QUEUE_CONCURRENCY) {
      const batch = jobInputs.slice(index, index + QUEUE_CONCURRENCY)
      await Promise.all(
        batch.map((input) =>
          payload.jobs.queue({
            workflow: 'processAnalyticsEvent',
            input,
          }),
        ),
      )
      queuedCount += batch.length
    }

    // Return immediately (jobs process async via cron)
    return NextResponse.json({ success: true, queued: queuedCount }, { status: 201 })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
