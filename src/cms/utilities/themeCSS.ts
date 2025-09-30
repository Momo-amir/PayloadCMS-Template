import type { Branding } from '@/payload-types'
import {
  defaultTheme,
  paletteToCSSVars,
  type ThemePalette,
} from '@/providers/Theme/InitTheme/defaultTheme'

// Updated to handle new nested structure with color and label
type PaletteWithLabels = Partial<{
  [K in keyof ThemePalette]: {
    color?: string
    label?: string
  }
}>

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

const withColorAliases = (cssVars: Record<string, string>): Record<string, string> => {
  const result: Record<string, string> = { ...cssVars }

  Object.keys(cssVars).forEach((varName) => {
    if (!varName.startsWith('--')) return

    const aliasName = `--color-${varName.slice(2)}`

    if (aliasName in result) return

    result[aliasName] = `var(${varName})`
  })

  return result
}

const mergeThemeValues = (
  defaults: ThemePalette,
  overrides: PaletteWithLabels | undefined,
): ThemePalette => {
  if (!overrides) return defaults

  const merged = { ...defaults }

  // Only apply overrides that have actual color values (not empty strings)
  Object.entries(overrides).forEach(([key, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      'color' in value &&
      value.color &&
      value.color.trim() !== ''
    ) {
      merged[key as keyof ThemePalette] = value.color
    }
  })

  return merged
}

export const generateThemeCSS = (branding: Branding | null | undefined): string => {
  const tc =
    branding && typeof branding === 'object' && 'themeColors' in branding
      ? branding.themeColors
      : undefined

  // Get user overrides with new structure
  const lightOverrides = tc?.light as PaletteWithLabels | undefined
  const darkOverrides = tc?.dark as PaletteWithLabels | undefined

  // Merge each theme independently - no cross-contamination
  const lightPalette = mergeThemeValues(defaultTheme.light, lightOverrides)
  const darkPalette = mergeThemeValues(defaultTheme.dark, darkOverrides)

  // Convert to CSS custom properties
  const lightCSSVars = paletteToCSSVars(lightPalette)
  const darkCSSVars = paletteToCSSVars(darkPalette)

  const lightDecls = toDecls(withColorAliases(lightCSSVars))
  const darkDecls = toDecls(withColorAliases(darkCSSVars))

  // Generate complete CSS with proper formatting
  const css = `
[data-theme='light'] {
${lightDecls}
}

[data-theme='dark'] {
${darkDecls}
}`.trim()

  return css
}
