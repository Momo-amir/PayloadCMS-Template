import {
  acceptAllConsentPreferences,
  defaultConsentPreferences,
  type ConsentPreferences,
} from '@/core/privacy/models/consent-model'

export function resolveConsentPreferences(
  accepted: boolean | Partial<ConsentPreferences>,
): ConsentPreferences {
  const preferences =
    typeof accepted === 'boolean'
      ? accepted
        ? acceptAllConsentPreferences()
        : defaultConsentPreferences()
      : {
          ...defaultConsentPreferences(),
          ...accepted,
          essential: true,
        }

  if (!preferences.analytics) {
    preferences.analyticsLocalStorage = false
    preferences.analyticsThirdPartySharing = false
  }

  return preferences
}

export function toGoogleConsentModeParams(preferences: ConsentPreferences): {
  analytics_storage: 'granted' | 'denied'
  ad_storage: 'granted' | 'denied'
  ad_user_data: 'granted' | 'denied'
  ad_personalization: 'granted' | 'denied'
} {
  return {
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    ad_storage: preferences.marketing ? 'granted' : 'denied',
    ad_user_data: preferences.marketing ? 'granted' : 'denied',
    ad_personalization: preferences.personalization ? 'granted' : 'denied',
  }
}
