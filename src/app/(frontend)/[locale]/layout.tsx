import type { Metadata } from 'next'

import { cn } from '@/cms/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/cms/components/AdminBar'
import { Footer } from '@/website/layout/Footer/Component'
import { Header } from '@/website/layout/Header/Component'
import { Providers } from '@/providers'
import { PrivacyProvider } from '@/providers/Privacy'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/cms/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { GoogleAnalytics } from '@/cms/components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@/cms/components/Analytics/GoogleTagManager'
import { PrivacyBanner } from '@/cms/components/PrivacyBanner'
import { NextIntlClientProvider } from 'next-intl'
import localization from '@/i18n/localization'
import { getMessages, setRequestLocale } from 'next-intl/server'

import './globals.css'
import { getServerSideURL } from '@/cms/utilities/getURL'
import { getBranding, toFaviconProps } from '@/cms/utilities/branding'
import { TypedLocale } from 'payload'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: TypedLocale }>
}) {
  const { isEnabled } = await draftMode()
  const branding = await getBranding()
  const { lightHref, darkHref, appleTouchIcon } = toFaviconProps(branding)

  const { locale } = await params
  const currentLocale =
    localization.locales.find((location) => location.code === locale) || localization.locales[0]

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <PrivacyProvider>
      <html
        className={cn(GeistSans.variable, GeistMono.variable)}
        lang={locale}
        suppressHydrationWarning
      >
        <head>
          <InitTheme />
          {/* Standard favicons with color scheme support */}
          <link
            href={darkHref}
            type={darkHref.endsWith('.png') ? 'image/png' : 'image/svg+xml'}
            rel="icon"
            media="(prefers-color-scheme: dark)"
            sizes="32x32"
          />
          <link
            href={lightHref}
            rel="icon"
            type={lightHref.endsWith('.png') ? 'image/png' : 'image/svg+xml'}
            media="(prefers-color-scheme: light)"
            sizes="32x32"
          />

          {/* Apple touch icons - use PNG format when available, fallback to light favicon */}
          <link href={appleTouchIcon} rel="apple-touch-icon" sizes="180x180" />

          {/* DNS Prefetch for Analytics */}
          <link href="https://www.googletagmanager.com" rel="preconnect" />
          <link href="https://www.google-analytics.com" rel="preconnect" />
        </head>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* Google Analytics */}
            <GoogleAnalytics />
            <GoogleTagManager />
            <Providers>
              <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              />

              <Header locale={locale} />
              {children}
              <Footer locale={locale} />
              <PrivacyBanner iconUrl={darkHref} />
            </Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    </PrivacyProvider>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
