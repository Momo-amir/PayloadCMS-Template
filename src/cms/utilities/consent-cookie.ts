/**
 * First-party consent cookie utilities
 *
 * Uses client-readable cookies (not HttpOnly) so track() can check consent
 * before sending analytics events.
 */
import {
  buildStoredConsentState,
  normalizeConsentState,
  type ConsentPreferences,
  type StoredConsentState,
} from './consent-model'

export const CONSENT_COOKIE_NAME = 'analytics_consent'
export const CONSENT_TOKEN_COOKIE_NAME = 'consent_token'
// GDPR: 12 months balances user convenience with periodic re-consent requirement
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 12 months in seconds

export type ConsentState = StoredConsentState & {
  analytics: boolean
}

/**
 * Get consent state from first-party cookie (client-side)
 */
export function getConsentFromCookie(): ConsentState | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  const consentCookie = cookies.find((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`))

  if (!consentCookie) return null

  try {
    const value = consentCookie.split('=')[1]
    if (!value) return null

    const decoded = decodeURIComponent(value)
    const normalized = normalizeConsentState(JSON.parse(decoded))
    if (!normalized) return null

    return {
      ...normalized,
      analytics: normalized.preferences.analytics,
    }
  } catch {
    return null
  }
}

/**
 * Set consent state in first-party cookie (client-side)
 */
export function setConsentCookie(preferences: boolean | Partial<ConsentPreferences>): void {
  if (typeof document === 'undefined') return

  const consentState =
    typeof preferences === 'boolean'
      ? buildStoredConsentState({
          analytics: preferences,
          analyticsLocalStorage: preferences,
          analyticsThirdPartySharing: false,
        })
      : buildStoredConsentState(preferences)

  const value = encodeURIComponent(JSON.stringify(consentState))

  // Set first-party cookie (readable by JavaScript)
  // SameSite=Lax for CSRF protection, Secure in production
  const isProduction = process.env.NODE_ENV === 'production'
  const isSecure = isProduction || window.location.protocol === 'https:'
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${isSecure ? '; Secure' : ''}`
}

/**
 * Clear consent cookie (must match domain used when setting)
 */
export function clearConsentCookie(): void {
  if (typeof document === 'undefined') return
  const isProduction = process.env.NODE_ENV === 'production'
  const isSecure = isProduction || window.location.protocol === 'https:'
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax${isSecure ? '; Secure' : ''}`
}

/**
 * Server-side: Read consent cookie from request headers
 */
export function getConsentFromHeaders(cookieHeader: string | null): ConsentState | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';')
  const consentCookie = cookies.find((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`))

  if (!consentCookie) return null

  try {
    const value = consentCookie.split('=')[1]
    if (!value) return null

    const decoded = decodeURIComponent(value)
    const normalized = normalizeConsentState(JSON.parse(decoded))
    if (!normalized) return null
    return {
      ...normalized,
      analytics: normalized.preferences.analytics,
    }
  } catch {
    return null
  }
}
