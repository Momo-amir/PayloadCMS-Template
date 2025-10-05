'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { Theme } from '@/providers/Theme/types'

type Area = 'header' | 'footer'

type OverridesMap = Partial<Record<Area, Theme | null>>

interface ContextType {
  overrides: OverridesMap
  setOverride: (area: Area, theme: Theme | null) => void
}

const initialContext: ContextType = {
  overrides: {},
  setOverride: () => null,
}

const LocalThemeContext = createContext<ContextType>(initialContext)

export const LocalThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [overrides, setOverrides] = useState<OverridesMap>({})

  const setOverride = useCallback((area: Area, theme: Theme | null) => {
    setOverrides((prev) => ({ ...prev, [area]: theme }))
  }, [])

  const value = useMemo(() => ({ overrides, setOverride }), [overrides, setOverride])

  return <LocalThemeContext.Provider value={value}>{children}</LocalThemeContext.Provider>
}

export const useLocalTheme = (
  area: Area,
): { override: Theme | null; setOverride: (theme: Theme | null) => void } => {
  const { overrides, setOverride } = useContext(LocalThemeContext)
  const override = (overrides?.[area] ?? null) as Theme | null
  const setAreaOverride = useCallback(
    (theme: Theme | null) => setOverride(area, theme),
    [area, setOverride],
  )
  return { override, setOverride: setAreaOverride }
}

export const useScopedLocalTheme = (
  area: Area,
  desired: Theme | null,
  options?: { resetOnUnmount?: boolean },
) => {
  const { setOverride } = useLocalTheme(area)
  const resetOnUnmount = options?.resetOnUnmount !== false

  // Apply desired override when it changes (ignore effective override to avoid tug-of-war)
  useEffect(() => {
    setOverride(desired)
  }, [desired, setOverride])

  // Reset on unmount only (not on re-renders)
  useEffect(() => {
    return () => {
      if (resetOnUnmount) setOverride(null)
    }
  }, [resetOnUnmount, setOverride])
}

export const useHeaderThemeOverride = (
  desired: Theme | null,
  options?: { resetOnUnmount?: boolean },
) => useScopedLocalTheme('header', desired, options)
