'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'
import { updateAnalyticsConsent } from '@/cms/utilities/analytics-server'
import { getConsentFromCookie, setConsentCookie } from '@/cms/utilities/consent-cookie'
import { type ConsentPreferences } from '@/cms/utilities/consent-model'
import { updateConsent as updateGoogleConsentMode } from '@/cms/utilities/analytics'
import { resolveConsentPreferences, toGoogleConsentModeParams } from './helpers'

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

    // Check first-party cookie for existing consent
    const consentState = getConsentFromCookie()

    if (consentState) {
      // User has made a choice - sync to in-memory state
      const normalizedPreferences = consentState.preferences
      const hasConsent = normalizedPreferences.analytics
      setConsentPreferences(normalizedPreferences)
      setCookieConsent(hasConsent)
      updateAnalyticsConsent(hasConsent)
      updateGoogleConsentMode('update', toGoogleConsentModeParams(normalizedPreferences))
      setShowConsent(false) // Don't show banner
    } else {
      // No consent cookie found - first visit or expired
      // Show banner for user to make choice
      setConsentPreferences(undefined)
      setCookieConsent(undefined)
      setShowConsent(true)
    }

    setCountry('GDPR')
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
