import type { Metadata } from 'next'

import { cn } from '@/cms/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/cms/components/AdminBar'
import { Footer } from '@/website/layout/Footer/Component'
import { Header } from '@/website/layout/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/cms/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.scss'
import { getServerSideURL } from '@/cms/utilities/getURL'
import { getBranding, mediaToURL } from '@/cms/utilities/branding'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const branding = await getBranding()
  const lightFavicon =
    branding?.faviconLight && typeof branding.faviconLight === 'object'
      ? mediaToURL(branding.faviconLight)
      : undefined
  const darkFavicon =
    branding?.faviconDark && typeof branding.faviconDark === 'object'
      ? mediaToURL(branding.faviconDark)
      : undefined

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link
          href={darkFavicon || '/assets/favicon-darkmode.svg'}
          type={darkFavicon?.endsWith('.png') ? 'image/png' : 'image/svg+xml'}
          rel="icon"
          media="(prefers-color-scheme: dark)"
          sizes="32x32"
        />
        <link
          href={lightFavicon || '/assets/favicon-lightmode.svg'}
          rel="icon"
          type={lightFavicon?.endsWith('.png') ? 'image/png' : 'image/svg+xml'}
          media="(prefers-color-scheme: light)"
        />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
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
