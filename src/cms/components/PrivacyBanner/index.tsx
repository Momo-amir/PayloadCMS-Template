'use client'

import { defaultConsentPreferences } from '@/cms/utilities/consent-model'
import { usePrivacy } from '@/providers/Privacy'
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import * as React from 'react'

type PrivacyBannerProps = {
  iconUrl: string
}

export const PrivacyBanner: React.FC<PrivacyBannerProps> = ({ iconUrl }) => {
  const [closeBanner, setCloseBanner] = React.useState(false)
  const [animateOut, setAnimateOut] = React.useState(false)
  const [customizeMode, setCustomizeMode] = React.useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(false)
  const [analyticsThirdPartySharing, setAnalyticsThirdPartySharing] = React.useState(false)
  const [marketingEnabled, setMarketingEnabled] = React.useState(false)
  const [personalizationEnabled, setPersonalizationEnabled] = React.useState(false)
  const [customizePanelHeight, setCustomizePanelHeight] = React.useState(0)
  const customizePanelRef = React.useRef<HTMLDivElement>(null)

  const { showConsent, updateCookieConsent, bannerRequestId, consentPreferences } = usePrivacy()
  const t = useTranslations()

  const handleCloseBanner = () => {
    setAnimateOut(true)
  }

  React.useEffect(() => {
    if (!animateOut) return
    const timeout = setTimeout(() => {
      setCustomizeMode(false)
      setCloseBanner(true)
    }, 300)
    return () => clearTimeout(timeout)
  }, [animateOut])

  React.useEffect(() => {
    if (!showConsent) return
    const existing = consentPreferences || defaultConsentPreferences()
    setCustomizeMode(false)
    setAnalyticsEnabled(existing.analytics)
    setAnalyticsThirdPartySharing(existing.analyticsThirdPartySharing)
    setMarketingEnabled(existing.marketing)
    setPersonalizationEnabled(existing.personalization)
    setCloseBanner(false)
    setAnimateOut(false)
  }, [showConsent, bannerRequestId, consentPreferences])

  React.useEffect(() => {
    const panel = customizePanelRef.current
    if (!panel) return

    const updateHeight = () => {
      setCustomizePanelHeight(panel.scrollHeight)
    }

    updateHeight()
    if (customizeMode) requestAnimationFrame(updateHeight)

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => updateHeight())
    observer.observe(panel)
    return () => observer.disconnect()
  }, [
    customizeMode,
    analyticsEnabled,
    analyticsThirdPartySharing,
    marketingEnabled,
    personalizationEnabled,
  ])

  const saveCurrentChoices = () => {
    setCustomizeMode(false)
    updateCookieConsent({
      essential: true,
      analytics: analyticsEnabled,
      analyticsLocalStorage: analyticsEnabled,
      analyticsThirdPartySharing: analyticsEnabled && analyticsThirdPartySharing,
      marketing: marketingEnabled,
      personalization: personalizationEnabled,
    })
    requestAnimationFrame(() => handleCloseBanner())
  }

  if ((!showConsent && !animateOut) || closeBanner) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-1000 max-w-md bg-black text-white rounded-lg shadow-2xl p-6 transition-all duration-300 ${
        animateOut ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="mb-4 flex items-center gap-2">
        <Image src={iconUrl} alt="Logo" width={24} height={24} className="w-6 h-6" />
        <span className="text-h3 font-medium">{t('cookie-consent:title')}</span>
      </div>

      <p className="text-sm leading-relaxed mb-4">
        {t('cookie-consent:message')}{' '}
        <Link className="underline hover:opacity-80" href="/privatlivspolitik" prefetch={false}>
          {t('cookie-consent:privacy-policy')}
        </Link>{' '}
        {t('cookie-consent:more-info')}
      </p>

      <div
        aria-hidden={!customizeMode}
        className={`overflow-hidden transition-opacity duration-200 ${
          customizeMode
            ? 'h-(--radix-accordion-content-height) animate-accordion-down opacity-100 mb-4'
            : 'h-0 animate-accordion-up opacity-0 mb-0'
        }`}
        style={
          {
            '--radix-accordion-content-height': `${customizePanelHeight}px`,
          } as React.CSSProperties
        }
      >
        <div
          ref={customizePanelRef}
          className="space-y-3 border border-white/20 rounded-md p-3 text-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span>{t('cookie-consent:essential-cookies')}</span>
              <p className="text-white/70 text-xs mt-1">
                {t('cookie-consent:essential-description')}
              </p>
            </div>
            <input
              type="checkbox"
              checked
              disabled
              className="h-4 w-4 accent-[rgba(255,255,255,0.1)] disabled:opacity-70"
            />
          </div>

          <label className="flex items-center justify-between gap-3">
            <span>{t('cookie-consent:analytics')}</span>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(event) => {
                const checked = event.target.checked
                setAnalyticsEnabled(checked)
                if (!checked) {
                  setAnalyticsThirdPartySharing(false)
                }
              }}
              className="h-4 w-4 accent-[rgba(255,255,255,0.1)]"
            />
          </label>

          <label className="flex items-center justify-between gap-3 pl-3 opacity-90">
            <span>{t('cookie-consent:analytics-third-party-sharing')}</span>
            <input
              type="checkbox"
              checked={analyticsEnabled && analyticsThirdPartySharing}
              disabled={!analyticsEnabled}
              onChange={(event) => setAnalyticsThirdPartySharing(event.target.checked)}
              className="h-4 w-4 accent-[rgba(255,255,255,0.1)] disabled:opacity-40"
            />
          </label>

          <label className="flex items-center justify-between gap-3">
            <span>{t('cookie-consent:marketing')}</span>
            <input
              type="checkbox"
              checked={marketingEnabled}
              onChange={(event) => setMarketingEnabled(event.target.checked)}
              className="h-4 w-4 accent-[rgba(255,255,255,0.1)]"
            />
          </label>

          <label className="flex items-center justify-between gap-3">
            <span>{t('cookie-consent:personalization')}</span>
            <input
              type="checkbox"
              checked={personalizationEnabled}
              onChange={(event) => setPersonalizationEnabled(event.target.checked)}
              className="h-4 w-4 accent-[rgba(255,255,255,0.1)]"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        {!customizeMode ? (
          <button
            aria-label={t('cookie-consent:customize-aria-label')}
            className="h-10 w-10 shrink-0 flex items-center justify-center text-sm font-medium bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
            onClick={() => setCustomizeMode(true)}
            type="button"
          >
            <IconAdjustmentsHorizontal size={18} />
          </button>
        ) : null}

        {!customizeMode ? (
          <button
            className="flex-1 px-3 py-2 text-sm font-medium whitespace-nowrap bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
            onClick={() => {
              updateCookieConsent(false)
              handleCloseBanner()
            }}
            type="button"
          >
            {t('cookie-consent:decline')}
          </button>
        ) : null}

        {customizeMode ? (
          <button
            className="flex-1 px-3 py-2 text-sm font-medium whitespace-nowrap bg-white/10 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
            onClick={() => setCustomizeMode(false)}
            type="button"
          >
            {t('cookie-consent:back')}
          </button>
        ) : null}

        {customizeMode ? (
          <button
            className="flex-1 px-3 py-2 text-sm font-medium whitespace-nowrap bg-white text-black hover:bg-white/90 rounded-md transition-colors cursor-pointer"
            onClick={saveCurrentChoices}
            type="button"
          >
            {t('cookie-consent:save-choices')}
          </button>
        ) : (
          <button
            className="flex-1 px-3 py-2 text-sm font-medium whitespace-nowrap bg-white text-black hover:bg-white/90 rounded-md transition-colors cursor-pointer"
            onClick={() => {
              updateCookieConsent(true)
              handleCloseBanner()
            }}
            type="button"
          >
            {t('cookie-consent:accept')}
          </button>
        )}
      </div>
    </div>
  )
}
