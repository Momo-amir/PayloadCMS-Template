'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'
import { updateConsent } from '@/cms/utilities/analytics'

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

type CookieConsent = {
  accepted: boolean
  at: string
  country: string
}

const canUseDOM = typeof window !== 'undefined'

const getLocalStorage = (): CookieConsent | null =>
  canUseDOM ? JSON.parse(window.localStorage.getItem('cookieConsent') || 'null') : null

const setLocalStorage = (accepted: boolean, country: string) => {
  if (!canUseDOM) return

  const cookieConsent: CookieConsent = {
    accepted,
    at: new Date().toISOString(),
    country,
  }
  window.localStorage.setItem('cookieConsent', JSON.stringify(cookieConsent))
}

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showConsent, setShowConsent] = useState<boolean | undefined>()
  const [cookieConsent, setCookieConsent] = useState<boolean | undefined>()
  const [country, setCountry] = useState<string | undefined>()
  const [bannerRequestId, setBannerRequestId] = useState(0)

  const updateCookieConsent = useCallback(
    (accepted: boolean) => {
      setCookieConsent(accepted)
      setLocalStorage(accepted, country || '')

      // Update Google Consent Mode
      updateConsent('update', {
        analytics_storage: accepted ? 'granted' : 'denied',
        ad_storage: accepted ? 'granted' : 'denied',
        ad_user_data: accepted ? 'granted' : 'denied',
        ad_personalization: accepted ? 'granted' : 'denied',
      })
    },
    [country],
  )

  useEffect(() => {
    const consent = getLocalStorage()
    if (consent) {
      setCountry(consent.country)
      setCookieConsent(consent.accepted || false)

      // Update consent mode with stored preference
      updateConsent('update', {
        analytics_storage: consent.accepted ? 'granted' : 'denied',
        ad_storage: consent.accepted ? 'granted' : 'denied',
        ad_user_data: consent.accepted ? 'granted' : 'denied',
        ad_personalization: consent.accepted ? 'granted' : 'denied',
      })
      setShowConsent(false)
      return
    }

    // Treat everyone as GDPR by default and always show the banner until a choice is made.
    setCountry('GDPR')
    setShowConsent(true)
  }, [updateCookieConsent])

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
