import React from 'react'

import { ThemeProvider } from '..'
import { LocalThemeProvider } from './LocalTheme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <LocalThemeProvider>{children}</LocalThemeProvider>
    </ThemeProvider>
  )
}
