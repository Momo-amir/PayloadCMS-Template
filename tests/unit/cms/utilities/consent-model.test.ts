import { describe, expect, it } from 'vitest'
import {
  CONSENT_POLICY_VERSION,
  acceptAllConsentPreferences,
  buildStoredConsentState,
  defaultConsentPreferences,
  normalizeConsentState,
} from '@/cms/utilities/consent-model'

describe('consent-model', () => {
  it('returns strict default consent preferences', () => {
    expect(defaultConsentPreferences()).toEqual({
      essential: true,
      analytics: false,
      analyticsLocalStorage: false,
      analyticsThirdPartySharing: false,
      marketing: false,
      personalization: false,
    })
  })

  it('returns accept-all preferences', () => {
    expect(acceptAllConsentPreferences()).toEqual({
      essential: true,
      analytics: true,
      analyticsLocalStorage: true,
      analyticsThirdPartySharing: true,
      marketing: true,
      personalization: true,
    })
  })

  it('normalizes explicit preferences and enforces analytics dependency', () => {
    const normalized = normalizeConsentState({
      preferences: {
        analytics: false,
        analyticsLocalStorage: true,
        analyticsThirdPartySharing: true,
        marketing: true,
      },
      version: 2,
      timestamp: 123,
    })

    expect(normalized).toEqual({
      preferences: {
        essential: true,
        analytics: false,
        analyticsLocalStorage: false,
        analyticsThirdPartySharing: false,
        marketing: true,
        personalization: false,
      },
      version: 2,
      timestamp: 123,
    })
  })

  it('supports legacy consent shape', () => {
    const normalized = normalizeConsentState({
      analytics: true,
      version: 1,
      timestamp: 999,
    })

    expect(normalized).toEqual({
      preferences: {
        essential: true,
        analytics: true,
        analyticsLocalStorage: true,
        analyticsThirdPartySharing: false,
        marketing: false,
        personalization: false,
      },
      version: 1,
      timestamp: 999,
    })
  })

  it('builds stored state with policy version by default', () => {
    const built = buildStoredConsentState({
      analytics: true,
      analyticsThirdPartySharing: true,
    })

    expect(built.version).toBe(CONSENT_POLICY_VERSION)
    expect(built.preferences).toMatchObject({
      essential: true,
      analytics: true,
      analyticsLocalStorage: true,
      analyticsThirdPartySharing: true,
    })
    expect(typeof built.timestamp).toBe('number')
  })
})
