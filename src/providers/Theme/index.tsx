'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/cms/utilities/canUseDOM'
import { themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: 'light', // Set initial context theme to light
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light') // Always start with light theme

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null || themeToSet === 'dark') {
      // Even if user tries to set null or dark theme, we force light
      setThemeState('light')
      window.localStorage.setItem(themeLocalStorageKey, 'light')
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      setThemeState(themeToSet)
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
  }, [])

  useEffect(() => {
    // Always set to light theme on initial load
    document.documentElement.setAttribute('data-theme', 'light')
    window.localStorage.setItem(themeLocalStorageKey, 'light')
    setThemeState('light')
  }, [])

  return <ThemeContext.Provider value={{ setTheme, theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
