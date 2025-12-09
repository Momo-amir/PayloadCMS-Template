'use client'

import { usePrivacy } from '@/providers/Privacy'
import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'

type PrivacyBannerProps = {
  iconUrl: string
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({ iconUrl }) => {
  const [closeBanner, setCloseBanner] = React.useState(false)
  const [animateOut, setAnimateOut] = React.useState(false)

  const { showConsent, updateCookieConsent } = usePrivacy()

  const handleCloseBanner = () => {
    setAnimateOut(true)
  }

  React.useEffect(() => {
    if (animateOut) {
      setTimeout(() => {
        setCloseBanner(true)
      }, 300)
    }
  }, [animateOut])

  if (!showConsent || closeBanner) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-1000 max-w-md bg-black text-white rounded-lg shadow-2xl p-6 transition-all duration-300 ${
        animateOut ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Branding Logo */}
      <div className="mb-4 flex items-center gap-2">
        <Image src={iconUrl} alt="Logo" width={24} height={24} className="w-6 h-6" />
        <span className="text-h3 font-medium ">Cookie Preferences</span>
      </div>

      <p className="text-sm leading-relaxed mb-4">
        We use cookies, subject to your consent, to analyze the use of our website and to ensure you
        get the best experience. Third parties with whom we collaborate can also install cookies in
        order to show you personalized content. Read our{' '}
        <Link className="underline hover:opacity-80" href="/privacy-policy" prefetch={false}>
          privacy policy
        </Link>{' '}
        for more information.
      </p>
      <div className="flex gap-3">
        <button
          className="flex-1 px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
          onClick={() => {
            updateCookieConsent(false)
            handleCloseBanner()
          }}
          type="button"
        >
          Dismiss
        </button>
        <button
          className="flex-1 px-4 py-2 text-sm font-medium bg-white text-black hover:bg-white/90 rounded-md transition-colors cursor-pointer"
          onClick={() => {
            updateCookieConsent(true)
            handleCloseBanner()
          }}
          type="button"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
