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
import { PrivacyBanner } from '@/cms/components/PrivacyBanner'
import { ScrollDepthTracker } from '@/cms/components/Analytics/AutoTracker'
import { NextIntlClientProvider } from 'next-intl'
import localization from '@/i18n/localization'
import { getMessages, setRequestLocale } from 'next-intl/server'

import './globals.css'
import { getServerSideURL } from '@/cms/utilities/getURL'
import { getCustomization, getPostsPagePath, toFaviconProps } from '@/cms/utilities/customization'
import { CollectionPathsProvider } from '@/providers/CollectionPaths'
import { TypedLocale } from 'payload'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { isEnabled } = await draftMode()
  const customization = await getCustomization()()
  const { lightHref, darkHref, appleTouchIcon } = toFaviconProps(customization)
  const postsBasePath = getPostsPagePath(customization)

  const { locale } = await params
  const _currentLocale =
    localization.locales.find((location) => location.code === locale) || localization.locales[0]

  if (!routing.locales.includes(locale as TypedLocale)) {
    notFound()
  }

  const typedLocale = locale as TypedLocale

  setRequestLocale(typedLocale)
  const messages = await getMessages()

  return (
    <PrivacyProvider>
      <html
        className={cn(GeistSans.variable, GeistMono.variable)}
        lang={typedLocale}
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
        </head>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <CollectionPathsProvider postsBasePath={postsBasePath}>
              <ScrollDepthTracker />
              <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              />

              <Header locale={typedLocale} />
              {children}
              <Footer locale={typedLocale} />
              <PrivacyBanner iconUrl={darkHref} />
              </CollectionPathsProvider>
            </Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    </PrivacyProvider>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph(),
    twitter: {
      card: 'summary_large_image',
      creator: '@payloadcms',
    },
  }
}
