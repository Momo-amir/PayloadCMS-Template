// Default theme values - Single source of truth
export const defaultTheme = {
  light: {
    primary: '#09090d',
    secondary: '#231B67',
    tertiary: '#35296b',
    base: '#ffffff',
    accent1: '#F3E9FF',
    accent2: '#c7bad9',
    accent3: '#fb823b',
    border: '#eee',
    neutral: '#eee',
    neutral2: '#f8d4a2',
    highlight: '#B00020',
    highlight2: '#e5fcfb',
  },
  dark: {
    primary: '#e8e8e8',
    secondary: '#231B67',
    tertiary: '#50477b',
    base: '#121212',
    accent1: '#F3E9FF',
    accent2: '#352d6a',
    accent3: '#fb823b',
    border: '#eee',
    neutral: '#eee',
    neutral2: '#f8d4a2',
    highlight: '#CF6679',
    highlight2: '#e5fcfb',
  },
} as const

export type ThemePalette = {
  primary: string
  secondary: string
  tertiary: string
  base: string
  accent1: string
  accent2: string
  accent3: string
  border: string
  neutral: string
  neutral2: string
  highlight: string
  highlight2: string
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
      // Convert camelCase or mixed keys to kebab-case and add leading '--'
      const cssVarName = `--${key
        .replace(/([a-z])([0-9])/g, '$1-$2')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()}`
      cssVars[cssVarName] = value
    }
  })

  return cssVars
}
