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

import './globals.css'
import { getServerSideURL } from '@/cms/utilities/getURL'
import { getBranding, toFaviconProps } from '@/cms/utilities/branding'

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const branding = await getBranding()
  const { lightHref, darkHref, appleTouchIcon } = toFaviconProps(branding)

  return (
    <PrivacyProvider>
      <html
        className={cn(GeistSans.variable, GeistMono.variable)}
        lang="en"
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

          {/* Google Analytics */}
          <GoogleAnalytics />
        </head>
        <body>
          <GoogleTagManager />
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header />
            {children}
            <Footer />
            <PrivacyBanner iconUrl={darkHref} />
          </Providers>
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
