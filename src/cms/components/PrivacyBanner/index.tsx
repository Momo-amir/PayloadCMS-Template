'use client'

import { defaultConsentPreferences } from '@/cms/utilities/consent-model'
import { usePrivacy } from '@/providers/Privacy'
import { IconAdjustmentsHorizontal, IconChevronDown } from '@tabler/icons-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import * as React from 'react'
import { Checkbox } from '@/website/components/elements/checkbox'

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
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({})
  const [customizePanelHeight, setCustomizePanelHeight] = React.useState(0)
  const customizePanelRef = React.useRef<HTMLDivElement>(null)

  const { showConsent, updateCookieConsent, bannerRequestId, consentPreferences } = usePrivacy()
  const t = useTranslations()
  const checkboxClassName =
    'h-4 w-4 border-white/60 bg-transparent data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-white'

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
    setExpandedSections({})
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

  const toggleSection = (section: string) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }))
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
        <div ref={customizePanelRef} className="space-y-3  rounded-md p-3 text-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => toggleSection('essential')}
                className="inline-flex items-center gap-1 text-left text-sm cursor-pointer"
              >
                <span>{t('cookie-consent:essential-cookies')}</span>
                <IconChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    expandedSections.essential ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  expandedSections.essential
                    ? 'grid-rows-[1fr] opacity-100 mt-1'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm leading-relaxed text-white/70">
                    {t('cookie-consent:essential-details')}
                  </p>
                </div>
              </div>
            </div>
            <Checkbox checked disabled className={`${checkboxClassName} disabled:opacity-70`} />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleSection('analytics')}
                className="inline-flex items-center gap-1 text-left text-sm cursor-pointer"
              >
                <span>{t('cookie-consent:analytics')}</span>
                <IconChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    expandedSections.analytics ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <Checkbox
                checked={analyticsEnabled}
                onCheckedChange={(checked) => {
                  const enabled = checked === true
                  setAnalyticsEnabled(enabled)
                  if (!enabled) {
                    setAnalyticsThirdPartySharing(false)
                  }
                }}
                className={checkboxClassName}
              />
            </div>
            <div
              className={`grid transition-all duration-300 ease-out ${
                expandedSections.analytics
                  ? 'grid-rows-[1fr] opacity-100 mt-1'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-white/70">
                  {t('cookie-consent:analytics-details')}
                </p>
              </div>
            </div>
          </div>

          <div className="pl-3 opacity-90">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleSection('analyticsThirdParty')}
                className="inline-flex items-center gap-1 text-left text-sm cursor-pointer"
              >
                <span>{t('cookie-consent:analytics-third-party-sharing')}</span>
                <IconChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    expandedSections.analyticsThirdParty ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <Checkbox
                checked={analyticsEnabled && analyticsThirdPartySharing}
                disabled={!analyticsEnabled}
                onCheckedChange={(checked) => setAnalyticsThirdPartySharing(checked === true)}
                className={`${checkboxClassName} disabled:opacity-40`}
              />
            </div>
            <div
              className={`grid transition-all duration-300 ease-out ${
                expandedSections.analyticsThirdParty
                  ? 'grid-rows-[1fr] opacity-100 mt-1'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-white/70">
                  {t('cookie-consent:analytics-third-party-details')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleSection('marketing')}
                className="inline-flex items-center gap-1 text-left text-sm cursor-pointer"
              >
                <span>{t('cookie-consent:marketing')}</span>
                <IconChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    expandedSections.marketing ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <Checkbox
                checked={marketingEnabled}
                onCheckedChange={(checked) => setMarketingEnabled(checked === true)}
                className={checkboxClassName}
              />
            </div>
            <div
              className={`grid transition-all duration-300 ease-out ${
                expandedSections.marketing
                  ? 'grid-rows-[1fr] opacity-100 mt-1'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-white/70">
                  {t('cookie-consent:marketing-details')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleSection('personalization')}
                className="inline-flex items-center gap-1 text-left text-sm cursor-pointer"
              >
                <span>{t('cookie-consent:personalization')}</span>
                <IconChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    expandedSections.personalization ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <Checkbox
                checked={personalizationEnabled}
                onCheckedChange={(checked) => setPersonalizationEnabled(checked === true)}
                className={checkboxClassName}
              />
            </div>
            <div
              className={`grid transition-all duration-300 ease-out ${
                expandedSections.personalization
                  ? 'grid-rows-[1fr] opacity-100 mt-1'
                  : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-white/70">
                  {t('cookie-consent:personalization-details')}
                </p>
              </div>
            </div>
          </div>
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
