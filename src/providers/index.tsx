import React from 'react'

import { ThemeProvider } from './Theme'
import { LocalThemeProvider } from './Theme/LocalTheme/LocalTheme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <LocalThemeProvider>{children}</LocalThemeProvider>
    </ThemeProvider>
  )
}
