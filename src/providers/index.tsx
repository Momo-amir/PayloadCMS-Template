import React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'

import { ThemeProvider } from './Theme'
import { LocalThemeProvider } from './Theme/LocalTheme/LocalTheme'
import { CollectionPathsProvider } from './CollectionPaths'
import { AuthProvider } from './Auth'

export const Providers: React.FC<{
  children: React.ReactNode
  locale: string
  messages: AbstractIntlMessages
  postsBasePath: string
}> = ({ children, locale, messages, postsBasePath }) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <LocalThemeProvider>
          <CollectionPathsProvider postsBasePath={postsBasePath}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </CollectionPathsProvider>
        </LocalThemeProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
