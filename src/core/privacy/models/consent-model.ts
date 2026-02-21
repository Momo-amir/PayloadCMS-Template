export const CONSENT_POLICY_VERSION = 2

export type ConsentPreferences = {
  essential: boolean
  analytics: boolean
  analyticsLocalStorage: boolean
  analyticsThirdPartySharing: boolean
  marketing: boolean
  personalization: boolean
}

export type StoredConsentState = {
  preferences: ConsentPreferences
  timestamp: number
  version: number
}

export const defaultConsentPreferences = (): ConsentPreferences => ({
  essential: true,
  analytics: false,
  analyticsLocalStorage: false,
  analyticsThirdPartySharing: false,
  marketing: false,
  personalization: false,
})

export const acceptAllConsentPreferences = (): ConsentPreferences => ({
  essential: true,
  analytics: true,
  analyticsLocalStorage: true,
  analyticsThirdPartySharing: true,
  marketing: true,
  personalization: true,
})

type LegacyConsentShape = {
  analytics?: boolean
  timestamp?: number
  version?: number
}

function sanitizePreferences(
  preferences: Partial<ConsentPreferences> | undefined | null,
): ConsentPreferences {
  const base = defaultConsentPreferences()
  if (!preferences) return base

  const analytics = preferences.analytics === true
  const analyticsLocalStorage =
    analytics && (preferences.analyticsLocalStorage ?? true) === true
  const analyticsThirdPartySharing =
    analytics && (preferences.analyticsThirdPartySharing ?? false) === true

  return {
    essential: true,
    analytics,
    analyticsLocalStorage,
    analyticsThirdPartySharing,
    marketing: preferences.marketing === true,
    personalization: preferences.personalization === true,
  }
}

export function normalizeConsentState(raw: unknown): StoredConsentState | null {
  if (!raw || typeof raw !== 'object') return null

  const maybeState = raw as {
    preferences?: Partial<ConsentPreferences>
    timestamp?: number
    version?: number
    analytics?: boolean
  }

  const timestamp =
    typeof maybeState.timestamp === 'number' && Number.isFinite(maybeState.timestamp)
      ? maybeState.timestamp
      : Date.now()
  const version =
    typeof maybeState.version === 'number' && Number.isFinite(maybeState.version)
      ? maybeState.version
      : 1

  if (maybeState.preferences && typeof maybeState.preferences === 'object') {
    return {
      preferences: sanitizePreferences(maybeState.preferences),
      timestamp,
      version,
    }
  }

  const legacy = raw as LegacyConsentShape
  if (typeof legacy.analytics === 'boolean') {
    return {
      preferences: sanitizePreferences({
        analytics: legacy.analytics,
        analyticsLocalStorage: legacy.analytics,
        analyticsThirdPartySharing: false,
      }),
      timestamp,
      version,
    }
  }

  return null
}

export function buildStoredConsentState(
  preferences: Partial<ConsentPreferences>,
  version: number = CONSENT_POLICY_VERSION,
): StoredConsentState {
  return {
    preferences: sanitizePreferences(preferences),
    timestamp: Date.now(),
    version,
  }
}
