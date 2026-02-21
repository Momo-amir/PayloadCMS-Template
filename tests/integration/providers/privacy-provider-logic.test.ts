import { describe, expect, it } from 'vitest'
import { resolveConsentPreferences, toGoogleConsentModeParams } from '@/providers/Privacy/helpers'

describe('PrivacyProvider logic', () => {
  it('maps boolean accept/reject to expected preferences', () => {
    const accepted = resolveConsentPreferences(true)
    const rejected = resolveConsentPreferences(false)

    expect(accepted).toMatchObject({
      essential: true,
      analytics: true,
      analyticsLocalStorage: true,
      analyticsThirdPartySharing: true,
      marketing: true,
      personalization: true,
    })
    expect(rejected).toMatchObject({
      essential: true,
      analytics: false,
      analyticsLocalStorage: false,
      analyticsThirdPartySharing: false,
      marketing: false,
      personalization: false,
    })
  })

  it('forces analytics sinks off when analytics=false in custom choices', () => {
    const preferences = resolveConsentPreferences({
      analytics: false,
      analyticsLocalStorage: true,
      analyticsThirdPartySharing: true,
      marketing: true,
      personalization: true,
    })

    expect(preferences.analytics).toBe(false)
    expect(preferences.analyticsLocalStorage).toBe(false)
    expect(preferences.analyticsThirdPartySharing).toBe(false)
    expect(preferences.marketing).toBe(true)
    expect(preferences.personalization).toBe(true)
  })

  it('converts preferences to Google Consent Mode params', () => {
    const params = toGoogleConsentModeParams(
      resolveConsentPreferences({
        analytics: true,
        analyticsLocalStorage: true,
        analyticsThirdPartySharing: false,
        marketing: false,
        personalization: true,
      }),
    )

    expect(params).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'granted',
    })
  })
})

