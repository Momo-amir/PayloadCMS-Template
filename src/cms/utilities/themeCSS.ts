import type { Branding } from '@/payload-types'
import {
  defaultTheme,
  paletteToCSSVars,
  type ThemePalette,
} from '@/providers/Theme/InitTheme/defaultTheme'

type Palette = Partial<ThemePalette>

const sanitize = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined
  // Allow common color syntax characters
  return /^[#a-zA-Z0-9(),.%\s-]+$/.test(v) ? v : undefined
}

const toDecls = (cssVars: Record<string, string>): string => {
  return Object.entries(cssVars)
    .map(([varName, value]) => {
      const sanitizedValue = sanitize(value)
      return sanitizedValue ? `  ${varName}: ${sanitizedValue};` : ''
    })
    .filter(Boolean)
    .join('\n')
}

const mergeThemeValues = (defaults: ThemePalette, overrides: Palette | undefined): ThemePalette => {
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

export const generateThemeCSS = (branding: Branding | null | undefined): string => {
  const tc =
    branding && typeof branding === 'object' && 'themeColors' in branding
      ? branding.themeColors
      : undefined

  // Get user overrides - completely separate for light and dark
  const lightOverrides = tc?.light as Palette | undefined
  const darkOverrides = tc?.dark as Palette | undefined

  // Merge each theme independently - no cross-contamination
  const lightPalette = mergeThemeValues(defaultTheme.light, lightOverrides)
  const darkPalette = mergeThemeValues(defaultTheme.dark, darkOverrides)

  // Convert to CSS custom properties
  const lightCSSVars = paletteToCSSVars(lightPalette)
  const darkCSSVars = paletteToCSSVars(darkPalette)

  const lightDecls = toDecls(lightCSSVars)
  const darkDecls = toDecls(darkCSSVars)

  // Generate complete CSS with proper formatting
  const css = `
:root, [data-theme='light'] {
${lightDecls}
}

[data-theme='dark'] {
${darkDecls}
}`.trim()

  return css
}
