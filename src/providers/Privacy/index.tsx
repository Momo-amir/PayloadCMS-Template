'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'
import { updateAnalyticsConsent } from '@/cms/utilities/analytics-server'

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
      // Update consent on server (sets HttpOnly cookie)
      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analytics: accepted }),
      })

      if (response.ok) {
        setCookieConsent(accepted)
        // Update analytics client consent status
        updateAnalyticsConsent(accepted)
        setShowConsent(false)
      }
    } catch (error) {
      console.error('Failed to update consent:', error)
    }
  }, [])

  useEffect(() => {
    // Check if user already has consent set (via server-side cookie)
    fetch('/api/consent')
      .then((res) => res.json())
      .then((data) => {
        if (data.analytics !== undefined) {
          // User has made a choice (accepted OR rejected)
          // Sync analytics client with consent status
          updateAnalyticsConsent(data.analytics)
          setCookieConsent(data.analytics)
          setShowConsent(false) // Don't show banner - choice already made
        } else {
          // First visit - no choice made yet
          setShowConsent(true)
        }
      })
      .catch(() => {
        // Error fetching consent - show banner to be safe
        setShowConsent(true)
      })

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
