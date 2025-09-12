// Default theme values - Single source of truth
export const defaultTheme = {
  light: {
    primary: '#09090d',
    secondary: '#231B67',
    tertiary: '#35296b',
    base: '#ffffff',
    accent: '#F3E9FF',
    accenttwo: '#c7bad9',
    accentthree: '#fb823b',
    border: '#eee',
    neutral: '#eee',
    neutraltwo: '#f8d4a2',
    highlight: '#B00020',
    highlighttwo: '#e5fcfb',
    white: '#ffffff',
    black: '#000000',
  },
  dark: {
    primary: '#e8e8e8',
    secondary: '#231B67',
    tertiary: '#50477b',
    base: '#121212',
    accent: '#F3E9FF',
    accenttwo: '#352d6a',
    accentthree: '#fb823b',
    border: '#eee',
    neutral: '#eee',
    neutraltwo: '#f8d4a2',
    highlight: '#CF6679',
    highlighttwo: '#e5fcfb',
    white: '#e8e8e8',
    black: '#000000',
  },
} as const

export type ThemePalette = {
  primary: string
  secondary: string
  tertiary: string
  base: string
  accent: string
  accenttwo: string
  accentthree: string
  border: string
  neutral: string
  neutraltwo: string
  highlight: string
  highlighttwo: string
  white: string
  black: string
}

export type ThemeMode = keyof typeof defaultTheme

// Helper to get a specific theme's values
export const getThemeValues = (mode: ThemeMode): ThemePalette => {
  return defaultTheme[mode]
}

// Helper to get all theme variable names
export const getThemeVariableNames = (): (keyof ThemePalette)[] => {
  return Object.keys(defaultTheme.light) as (keyof ThemePalette)[]
}

// Helper to merge theme values with user overrides
export const mergeThemeValues = (
  defaults: ThemePalette,
  overrides: Partial<ThemePalette> | undefined,
): ThemePalette => {
  if (!overrides) return defaults

  const merged = { ...defaults }

  // Only apply overrides that have actual values (not empty strings)
  Object.entries(overrides).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      merged[key as keyof ThemePalette] = value
    }
  })

  return merged
}

// Helper to convert palette to CSS custom properties
export const paletteToCSSVars = (palette: Partial<ThemePalette>): Record<string, string> => {
  const cssVars: Record<string, string> = {}

  Object.entries(palette).forEach(([key, value]) => {
    if (value) {
      // Use the key as-is, just add the CSS variable prefix
      const cssVarName = `--${key}`
      cssVars[cssVarName] = value
    }
  })

  return cssVars
}
