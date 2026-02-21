'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'
import { updateAnalyticsConsent } from '@/core/analytics/client/analytics-client'
import { updateConsent as updateGoogleConsentMode } from '@/core/analytics/client/consent-mode'
import { clearConsentCookie, setConsentCookie } from '@/core/privacy/client/consent-cookie'
import {
  CONSENT_POLICY_VERSION,
  defaultConsentPreferences,
  type ConsentPreferences,
} from '@/core/privacy/models/consent-model'
import { resolveConsentPreferences, toGoogleConsentModeParams } from './privacy-helpers'

type Privacy = {
  cookieConsent?: boolean
  consentPreferences?: ConsentPreferences
  country?: string
  showConsent?: boolean
  updateCookieConsent: (accepted: boolean | Partial<ConsentPreferences>) => void
  openConsentBanner: () => void
  bannerRequestId: number
}

const Context = createContext<Privacy>({
  cookieConsent: undefined,
  consentPreferences: undefined,
  country: undefined,
  showConsent: undefined,
  updateCookieConsent: () => false,
  openConsentBanner: () => false,
  bannerRequestId: 0,
})

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showConsent, setShowConsent] = useState<boolean | undefined>()
  const [cookieConsent, setCookieConsent] = useState<boolean | undefined>()
  const [consentPreferences, setConsentPreferences] = useState<ConsentPreferences | undefined>()
  const [country, setCountry] = useState<string | undefined>()
  const [bannerRequestId, setBannerRequestId] = useState(0)

  const updateCookieConsent = useCallback(
    async (accepted: boolean | Partial<ConsentPreferences>) => {
      const preferences = resolveConsentPreferences(accepted)

      try {
        // 1. Persist to server database first (source of truth / audit trail)
        const response = await fetch('/api/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences }),
        })

        if (!response.ok) {
          throw new Error(`Consent update failed with status ${response.status}`)
        }

        // 2. Set first-party cookie (readable by track() function)
        setConsentCookie(preferences)

        // 3. Update in-memory state (React context)
        setConsentPreferences(preferences)
        setCookieConsent(preferences.analytics)

        // 4. Update analytics client consent status
        updateAnalyticsConsent(preferences.analytics)
        updateGoogleConsentMode('update', toGoogleConsentModeParams(preferences))

        // 5. Hide banner after persistence + local sync
        setShowConsent(false)
      } catch (error) {
        console.error('Failed to update consent:', error)
        // Keep banner open so user can retry
        setShowConsent(true)
      }
    },
    [],
  )

  useEffect(() => {
    updateGoogleConsentMode('default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })

    let cancelled = false

    const initializeConsent = async () => {
      try {
        const response = await fetch('/api/consent', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error(`Consent bootstrap failed with status ${response.status}`)
        }

        const payload = (await response.json()) as {
          hasStoredConsent?: boolean
          preferences?: Partial<ConsentPreferences>
          version?: number
        }

        if (cancelled) return

        const hasStoredConsent = payload.hasStoredConsent === true
        const version = typeof payload.version === 'number' ? payload.version : 1
        const preferences = resolveConsentPreferences(payload.preferences || defaultConsentPreferences())

        if (!hasStoredConsent || version !== CONSENT_POLICY_VERSION) {
          clearConsentCookie()
          setConsentPreferences(undefined)
          setCookieConsent(undefined)
          updateAnalyticsConsent(false)
          setShowConsent(true)
          return
        }

        setConsentCookie(preferences)
        setConsentPreferences(preferences)
        setCookieConsent(preferences.analytics)
        updateAnalyticsConsent(preferences.analytics)
        updateGoogleConsentMode('update', toGoogleConsentModeParams(preferences))
        setShowConsent(false)
      } catch (error) {
        console.error('Failed to initialize consent:', error)
        if (cancelled) return

        clearConsentCookie()
        setConsentPreferences(undefined)
        setCookieConsent(undefined)
        updateAnalyticsConsent(false)
        setShowConsent(true)
      }
    }

    initializeConsent()

    setCountry('GDPR')

    return () => {
      cancelled = true
    }
  }, [])

  const openConsentBanner = useCallback(() => {
    setShowConsent(true)
    setBannerRequestId((current) => current + 1)
  }, [])

  return (
    <Context
      value={{
        cookieConsent,
        consentPreferences,
        country,
        showConsent,
        updateCookieConsent,
        openConsentBanner,
        bannerRequestId,
      }}
    >
      {children}
    </Context>
  )
}

export const usePrivacy = (): Privacy => use(Context)
