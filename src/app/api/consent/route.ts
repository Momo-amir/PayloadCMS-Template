import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { isTrustedOrigin } from '@/cms/utilities/isTrustedOrigin'
import {
  CONSENT_POLICY_VERSION,
  defaultConsentPreferences,
  normalizeConsentState,
  type ConsentPreferences,
} from '@/cms/utilities/consent-model'

function parsePreferences(body: unknown): ConsentPreferences | null {
  if (!body || typeof body !== 'object') return null

  const candidate = body as {
    analytics?: unknown
    preferences?: unknown
  }

  if (typeof candidate.analytics === 'boolean') {
    return {
      ...defaultConsentPreferences(),
      analytics: candidate.analytics,
      analyticsLocalStorage: candidate.analytics,
      analyticsThirdPartySharing: false,
    }
  }

  if (!candidate.preferences || typeof candidate.preferences !== 'object') return null

  const normalized = normalizeConsentState({
    preferences: candidate.preferences,
    version: CONSENT_POLICY_VERSION,
    timestamp: Date.now(),
  })

  return normalized?.preferences || null
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const preferences = parsePreferences(body)

    if (!preferences) {
      return NextResponse.json({ error: 'Invalid consent value' }, { status: 400 })
    }

    if (!isTrustedOrigin(request)) {
      return NextResponse.json({ error: 'Untrusted origin' }, { status: 403 })
    }

    const cookieStore = await cookies()
    let consentToken = cookieStore.get('consent_token')?.value

    if (!consentToken) {
      // Create new consent token
      consentToken = randomUUID()

      // Set expiry to 12 months from now (matching cookie expiry)
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 12)

      await payload.create({
        collection: 'consent-tokens',
        data: {
          token: consentToken,
          analytics: preferences.analytics,
          analyticsLocalStorage: preferences.analyticsLocalStorage,
          analyticsThirdPartySharing: preferences.analyticsThirdPartySharing,
          marketing: preferences.marketing,
          personalization: preferences.personalization,
          version: CONSENT_POLICY_VERSION,
          expiresAt: expiresAt.toISOString(),
        },
        overrideAccess: true,
      })
    } else {
      // Update existing consent
      const existing = await payload.find({
        collection: 'consent-tokens',
        where: { token: { equals: consentToken } },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length > 0 && existing.docs[0]?.id) {
        // Extend expiry when user updates consent (fresh 12 months)
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 12)

        await payload.update({
          collection: 'consent-tokens',
          id: existing.docs[0].id,
          data: {
            analytics: preferences.analytics,
            analyticsLocalStorage: preferences.analyticsLocalStorage,
            analyticsThirdPartySharing: preferences.analyticsThirdPartySharing,
            marketing: preferences.marketing,
            personalization: preferences.personalization,
            version: CONSENT_POLICY_VERSION,
            expiresAt: expiresAt.toISOString(),
          },
          overrideAccess: true,
        })
      } else {
        // Token not found, create new
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 12)

        await payload.create({
          collection: 'consent-tokens',
          data: {
            token: consentToken,
            analytics: preferences.analytics,
            analyticsLocalStorage: preferences.analyticsLocalStorage,
            analyticsThirdPartySharing: preferences.analyticsThirdPartySharing,
            marketing: preferences.marketing,
            personalization: preferences.personalization,
            version: CONSENT_POLICY_VERSION,
            expiresAt: expiresAt.toISOString(),
          },
          overrideAccess: true,
        })
      }
    }

    // If user is revoking consent, delete their queued analytics jobs
    if (!preferences.analytics) {
      // Delete any pending analytics workflow jobs for this consent token
      await payload.delete({
        collection: 'payload-jobs',
        where: {
          and: [
            { 'input.consent_token': { equals: consentToken } },
            { hasError: { equals: false } },
            { completedAt: { exists: false } }, // Only delete incomplete jobs
          ],
        },
        overrideAccess: true,
      })
    }

    // Set HttpOnly cookie with domain restriction
    const response = NextResponse.json({ success: true })
    response.cookies.set('consent_token', consentToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365, // 12 months
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Consent update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const consentToken = cookieStore.get('consent_token')?.value

    if (!consentToken) {
      return NextResponse.json({ preferences: defaultConsentPreferences(), analytics: false })
    }

    const payload = await getPayload({ config })
    const existing = await payload.find({
      collection: 'consent-tokens',
      where: { token: { equals: consentToken } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length === 0 || !existing.docs[0]) {
      return NextResponse.json({ preferences: defaultConsentPreferences(), analytics: false })
    }

    const consentDoc = existing.docs[0] as {
      analytics?: boolean | null
      analyticsLocalStorage?: boolean | null
      analyticsThirdPartySharing?: boolean | null
      marketing?: boolean | null
      personalization?: boolean | null
    }

    const preferences: ConsentPreferences = {
      essential: true,
      analytics: consentDoc.analytics ?? false,
      analyticsLocalStorage: consentDoc.analyticsLocalStorage ?? consentDoc.analytics ?? false,
      analyticsThirdPartySharing: consentDoc.analyticsThirdPartySharing ?? false,
      marketing: consentDoc.marketing ?? false,
      personalization: consentDoc.personalization ?? false,
    }

    return NextResponse.json({ preferences, analytics: preferences.analytics })
  } catch (error) {
    console.error('Consent get error:', error)
    return NextResponse.json({ preferences: defaultConsentPreferences(), analytics: false })
  }
}
