/**
 * First-party consent cookie utilities
 *
 * Uses client-readable cookies (not HttpOnly) so track() can check consent
 * before sending analytics events.
 */

export const CONSENT_COOKIE_NAME = 'analytics_consent'
export const CONSENT_TOKEN_COOKIE_NAME = 'consent_token'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year in seconds

export interface ConsentState {
  analytics: boolean
  timestamp: number
  version: number
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
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * Set consent state in first-party cookie (client-side)
 */
export function setConsentCookie(analytics: boolean): void {
  if (typeof document === 'undefined') return

  const consentState: ConsentState = {
    analytics,
    timestamp: Date.now(),
    version: 1,
  }

  const value = encodeURIComponent(JSON.stringify(consentState))

  // Set first-party cookie (readable by JavaScript)
  // SameSite=Lax for CSRF protection, Secure in production
  const isSecure = window.location.protocol === 'https:'
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${isSecure ? '; Secure' : ''}`
}

/**
 * Clear consent cookie
 */
export function clearConsentCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; max-age=0`
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
    return JSON.parse(decoded)
  } catch {
    return null
  }
}
