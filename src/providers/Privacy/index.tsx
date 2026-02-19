'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'
import { updateAnalyticsConsent } from '@/cms/utilities/analytics-server'
import { getConsentFromCookie, setConsentCookie } from '@/cms/utilities/consent-cookie'

type Privacy = {
  cookieConsent?: boolean
  country?: string
  showConsent?: boolean
  updateCookieConsent: (accepted: boolean) => void
  openConsentBanner: () => void
  bannerRequestId: number
}

const Context = createContext<Privacy>({
  cookieConsent: undefined,
  country: undefined,
  showConsent: undefined,
  updateCookieConsent: () => false,
  openConsentBanner: () => false,
  bannerRequestId: 0,
})

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showConsent, setShowConsent] = useState<boolean | undefined>()
  const [cookieConsent, setCookieConsent] = useState<boolean | undefined>()
  const [country, setCountry] = useState<string | undefined>()
  const [bannerRequestId, setBannerRequestId] = useState(0)

  const updateCookieConsent = useCallback(async (accepted: boolean) => {
    try {
      // 1. Persist to server database first (source of truth / audit trail)
      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analytics: accepted }),
      })

      if (!response.ok) {
        throw new Error(`Consent update failed with status ${response.status}`)
      }

      // 2. Set first-party cookie (readable by track() function)
      setConsentCookie(accepted)

      // 3. Update in-memory state (React context)
      setCookieConsent(accepted)

      // 4. Update analytics client consent status
      updateAnalyticsConsent(accepted)

      // 5. Hide banner after persistence + local sync
      setShowConsent(false)
    } catch (error) {
      console.error('Failed to update consent:', error)
      // Keep banner open so user can retry
      setShowConsent(true)
    }
  }, [])

  useEffect(() => {
    // Check first-party cookie for existing consent
    const consentState = getConsentFromCookie()

    if (consentState) {
      // User has made a choice - sync to in-memory state
      const hasConsent = consentState.analytics
      setCookieConsent(hasConsent)
      updateAnalyticsConsent(hasConsent)
      setShowConsent(false) // Don't show banner
    } else {
      // No consent cookie found - first visit or expired
      // Show banner for user to make choice
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
