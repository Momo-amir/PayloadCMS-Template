import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearConsentCookie,
  CONSENT_COOKIE_NAME,
  getConsentFromCookie,
  getConsentFromHeaders,
  setConsentCookie,
} from '@/cms/utilities/consent-cookie'

class CookieDocumentMock {
  private readonly cookieMap = new Map<string, string>()

  get cookie(): string {
    return [...this.cookieMap.entries()].map(([name, value]) => `${name}=${value}`).join('; ')
  }

  set cookie(value: string) {
    const [firstPart, ...attrs] = value.split(';')
    if (!firstPart) return

    const separatorIndex = firstPart.indexOf('=')
    if (separatorIndex < 0) return

    const name = firstPart.slice(0, separatorIndex).trim()
    const cookieValue = firstPart.slice(separatorIndex + 1).trim()
    const shouldDelete =
      cookieValue === '' || attrs.some((attr) => attr.trim().toLowerCase() === 'max-age=0')

    if (shouldDelete) {
      this.cookieMap.delete(name)
      return
    }

    this.cookieMap.set(name, cookieValue)
  }
}

describe('consent-cookie', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'document', {
      value: new CookieDocumentMock(),
      configurable: true,
      writable: true,
    })
    Object.defineProperty(globalThis, 'window', {
      value: { location: { protocol: 'https:' } },
      configurable: true,
      writable: true,
    })
  })

  it('stores and reads legacy boolean consent safely', () => {
    setConsentCookie(true)
    const state = getConsentFromCookie()

    expect(state?.analytics).toBe(true)
    expect(state?.preferences.analytics).toBe(true)
    expect(state?.preferences.analyticsLocalStorage).toBe(true)
    expect(state?.preferences.analyticsThirdPartySharing).toBe(false)
  })

  it('stores and reads structured consent preferences', () => {
    setConsentCookie({
      analytics: true,
      analyticsLocalStorage: true,
      analyticsThirdPartySharing: true,
      marketing: true,
      personalization: false,
    })

    const state = getConsentFromCookie()
    expect(state?.preferences).toMatchObject({
      essential: true,
      analytics: true,
      analyticsLocalStorage: true,
      analyticsThirdPartySharing: true,
      marketing: true,
      personalization: false,
    })
  })

  it('normalizes malformed structured values', () => {
    const raw = encodeURIComponent(
      JSON.stringify({
        preferences: {
          analytics: false,
          analyticsLocalStorage: true,
          analyticsThirdPartySharing: true,
        },
      }),
    )
    document.cookie = `${CONSENT_COOKIE_NAME}=${raw}`

    const state = getConsentFromCookie()
    expect(state?.preferences.analytics).toBe(false)
    expect(state?.preferences.analyticsLocalStorage).toBe(false)
    expect(state?.preferences.analyticsThirdPartySharing).toBe(false)
  })

  it('clears cookie', () => {
    setConsentCookie(true)
    clearConsentCookie()
    expect(getConsentFromCookie()).toBeNull()
  })

  it('reads consent from request headers', () => {
    const raw = encodeURIComponent(
      JSON.stringify({
        preferences: {
          essential: true,
          analytics: true,
          analyticsLocalStorage: true,
          analyticsThirdPartySharing: false,
          marketing: false,
          personalization: false,
        },
        version: 2,
        timestamp: 111,
      }),
    )

    const state = getConsentFromHeaders(
      `foo=bar; ${CONSENT_COOKIE_NAME}=${raw}; another_cookie=value`,
    )

    expect(state?.analytics).toBe(true)
    expect(state?.preferences.analyticsLocalStorage).toBe(true)
    expect(state?.preferences.analyticsThirdPartySharing).toBe(false)
  })
})
