import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 100
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

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

    const analyticsConfig = await payload.findGlobal({ slug: 'analytics-config' })

    if (!analyticsConfig?.enabled) {
      return NextResponse.json({ success: true }) // Silently accept but don't process
    }

    const country = analyticsConfig?.anonymize_ip ? getCountryFromIP(ip) : null
    const today = new Date().toISOString().split('T')[0]! // YYYY-MM-DD (always defined)

    // Process each event
    for (const event of events) {
      if (!event || !event.event_name) continue // Skip invalid events

      const normalizedPath = normalizeURL(event.page_path || '')
      const sanitizedData = sanitizeEventData(event.event_data || {})

      // Store aggregate if enabled
      if (analyticsConfig?.store_aggregates) {
        // Find or create aggregate record
        const existing = await payload.find({
          collection: 'analytics-aggregates',
          where: {
            and: [
              { event_name: { equals: event.event_name } },
              { page_path: { equals: normalizedPath } },
              { date: { equals: today } },
              { country: { equals: country || 'unknown' } },
            ],
          },
          limit: 1,
        })

        const existingDoc = existing.docs[0]
        if (existingDoc?.id) {
          // Increment existing
          await payload.update({
            collection: 'analytics-aggregates',
            id: existingDoc.id,
            data: {
              count: (existingDoc.count || 0) + 1,
            },
          })
        } else {
          // Create new
          await payload.create({
            collection: 'analytics-aggregates',
            data: {
              event_name: event.event_name,
              page_path: normalizedPath,
              count: 1,
              date: today,
              country: country || 'unknown',
              metadata: sanitizedData,
            },
            draft: false,
          })
        }
      }

      // Forward to Matomo if enabled
      if (analyticsConfig?.matomo_enabled) {
        const matomoUrl = process.env.MATOMO_URL
        const matomoSiteId = process.env.MATOMO_SITE_ID

        if (matomoUrl && matomoSiteId) {
          try {
            const params = new URLSearchParams({
              idsite: matomoSiteId,
              rec: '1',
              action_name: event.event_name,
              url: normalizedPath,
            })

            await fetch(`${matomoUrl}/matomo.php?${params.toString()}`, {
              method: 'GET',
            })
          } catch (error) {
            console.error('Matomo forward error:', error)
          }
        }
      }

      // Forward to GA4 if enabled
      if (analyticsConfig?.ga4_enabled) {
        const ga4MeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
        const ga4ApiSecret = process.env.GA4_API_SECRET

        if (ga4MeasurementId && ga4ApiSecret) {
          try {
            const ga4Payload = {
              client_id: consentToken.substring(0, 32),
              events: [
                {
                  name: event.event_name,
                  params: {
                    ...sanitizedData,
                    page_location: normalizedPath,
                    engagement_time_msec: '100', // Required by GA4
                  },
                },
              ],
            }

            const ga4Response = await fetch(
              `https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${ga4ApiSecret}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ga4Payload),
              },
            )

            if (!ga4Response.ok) {
              const errorText = await ga4Response.text()
              console.error('GA4 forward failed:', ga4Response.status, errorText)
            } else {
              console.log('GA4 event sent:', event.event_name)
            }
          } catch (error) {
            console.error('GA4 forward error:', error)
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
