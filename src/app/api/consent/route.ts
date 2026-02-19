import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { isTrustedOrigin } from '@/cms/utilities/isTrustedOrigin'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { analytics } = body

    if (typeof analytics !== 'boolean') {
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
          analytics,
          version: 1,
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
            analytics,
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
            analytics,
            version: 1,
            expiresAt: expiresAt.toISOString(),
          },
          overrideAccess: true,
        })
      }
    }

    // If user is revoking consent, delete their queued analytics jobs
    if (!analytics) {
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
      return NextResponse.json({ analytics: false })
    }

    const payload = await getPayload({ config })
    const existing = await payload.find({
      collection: 'consent-tokens',
      where: { token: { equals: consentToken } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length === 0 || !existing.docs[0]) {
      return NextResponse.json({ analytics: false })
    }

    return NextResponse.json({ analytics: existing.docs[0].analytics ?? false })
  } catch (error) {
    console.error('Consent get error:', error)
    return NextResponse.json({ analytics: false })
  }
}
