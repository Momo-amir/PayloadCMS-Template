// Default theme values - Single source of truth
export const defaultTheme = {
  light: {
    primary: '#060513',
    secondary: '#0E0E9A',
    tertiary: '#9ECDE4',
    base: '#ffffff',
    accent: '#6A37C0',
    accenttwo: '#C5A4E9',
    accentthree: '#E7D8FA',
    border: '#eee',
    neutral: '#eee',
    neutraltwo: '#A5A5AA',
    error: '#B00020',
    success: '#198754',
    white: '#ffffff',
    black: '#060513',
  },
  dark: {
    primary: '#e8e8e8',
    secondary: '#0E0E9A',
    tertiary: '#9ECDE4',
    base: '#121212',
    accent: '#6A37C0',
    accenttwo: '#C5A4E9',
    accentthree: '#E7D8FA',
    border: '#eee',
    neutral: '#eee',
    neutraltwo: '#A5A5AA',
    error: '#CF6679',
    success: '#5cb85c',
    white: '#e8e8e8',
    black: '#060513',
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
  error: string
  success: string
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
