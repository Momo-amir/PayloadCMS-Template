'use client'

import React, { createContext, use, useCallback, useEffect, useState } from 'react'
import { updateConsent } from '@/cms/utilities/analytics'

type Privacy = {
  cookieConsent?: boolean
  country?: string
  showConsent?: boolean
  updateCookieConsent: (accepted: boolean) => void
}

const Context = createContext<Privacy>({
  cookieConsent: undefined,
  country: undefined,
  showConsent: undefined,
  updateCookieConsent: () => false,
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
    ;(async () => {
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
        return
      }

      try {
        const gdpr = await fetch('/api/locate').then((res) => res.json())

        setCountry(gdpr.country || '')

        // Auto-accept for non-GDPR regions
        if (!gdpr.isGDPR) {
          setCookieConsent(true)
          updateCookieConsent(true)
        }

        setShowConsent(gdpr.isGDPR || false)
      } catch (error) {
        console.error('Error fetching location data:', error)
        // Default to showing consent banner on error (privacy-first approach)
        setShowConsent(true)
      }
    })()
  }, [updateCookieConsent])

  return (
    <Context value={{ cookieConsent, country, showConsent, updateCookieConsent }}>
      {children}
    </Context>
  )
}

export const usePrivacy = (): Privacy => use(Context)
