'use client'

import { usePrivacy } from '@/providers/Privacy'
import { analyticsEvent } from '@/cms/utilities/analytics'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import * as React from 'react'

const gaMeasurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const GoogleAnalytics: React.FC = () => {
  const pathname = usePathname()
  const { cookieConsent } = usePrivacy()

  // Update consent mode when user makes a choice
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return

    if (cookieConsent !== undefined) {
      window.gtag('consent', 'update', {
        analytics_storage: cookieConsent ? 'granted' : 'denied',
        ad_storage: cookieConsent ? 'granted' : 'denied',
        ad_user_data: cookieConsent ? 'granted' : 'denied',
        ad_personalization: cookieConsent ? 'granted' : 'denied',
      })
    }
  }, [cookieConsent])

  // Track page views
  React.useEffect(() => {
    if (!gaMeasurementID || !window?.location?.href || !cookieConsent) {
      return
    }

    analyticsEvent('page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    })
  }, [pathname, cookieConsent])

  if (!gaMeasurementID) {
    return null
  }

  return (
    <React.Fragment>
      {/* Google Consent Mode - Loaded before GA */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Set default consent to 'denied' as a placeholder
  // This will be updated once we know the user's region
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  });
`,
        }}
        id="google-consent-mode"
      />

      {/* Google Analytics */}
      <Script defer src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementID}`} />
      <Script
        dangerouslySetInnerHTML={{
          __html: `
  gtag('js', new Date());
  gtag('config', '${gaMeasurementID}', { 
    send_page_view: false,
    allow_google_signals: ${cookieConsent ? 'true' : 'false'},
    allow_ad_personalization_signals: ${cookieConsent ? 'true' : 'false'}
  });`,
        }}
        defer
        id="google-analytics"
      />
    </React.Fragment>
  )
}
