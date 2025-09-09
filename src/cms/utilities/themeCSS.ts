import type { Branding } from '@/payload-types'

type Palette = Partial<{
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
}>

const sanitize = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined
  // Allow common color syntax characters
  return /^[#a-zA-Z0-9(),.%\s-]+$/.test(v) ? v : undefined
}

const toDecls = (p?: Palette): string => {
  if (!p) return ''
  const map: Record<keyof Required<Palette>, string> = {
    primary: '--primary',
    secondary: '--secondary',
    tertiary: '--tertiary',
    base: '--base',
    accent1: '--accent-1',
    accent2: '--accent-2',
    accent3: '--accent-3',
    border: '--border',
    neutral: '--neutral',
    neutral2: '--neutral-2',
    highlight: '--highlight',
    highlight2: '--highlight-2',
  }
  return (Object.keys(map) as Array<keyof Palette>)
    .map((k) => {
      const varName = map[k as keyof Required<Palette>]
      const val = sanitize(p[k])
      return val ? `${varName}: ${val};` : ''
    })
    .filter(Boolean)
    .join('\n')
}

export const buildBrandingThemeCSS = (branding: Branding | null | undefined): string => {
  if (!branding || typeof branding !== 'object') return ''
  const tc = 'themeColors' in branding ? branding.themeColors : undefined

  // Define default values for fallback
  const defaultLight: Palette = {
    primary: '#09090d',
    secondary: '#1f2344',
    tertiary: '#35296b',
    base: '#ffffff',
    accent1: '#c4f5fa',
    accent2: '#bca4ea',
    accent3: '#fb823b',
    border: '#d9d9d9',
    neutral: '#f5efe1',
    neutral2: '#f8d4a2',
    highlight: '#fcf1c3',
    highlight2: '#e5fcfb',
  }

  const defaultDark: Palette = {
    primary: '#e8e8e8',
    secondary: '#1f2344',
    tertiary: '#35296b',
    base: '#09090d',
    accent1: '#c4f5fa',
    accent2: '#bca4ea',
    accent3: '#fb823b',
    border: '#d9d9d9',
    neutral: '#f5efe1',
    neutral2: '#f8d4a2',
    highlight: '#fcf1c3',
    highlight2: '#e5fcfb',
  }

  // Merge user values with defaults for fallback
  const lightPalette = { ...defaultLight, ...((tc?.light as Palette) || {}) }
  const darkPalette = { ...defaultDark, ...((tc?.dark as Palette) || {}) }

  const lightDecls = toDecls(lightPalette)
  const darkDecls = toDecls(darkPalette) // Always generate dark mode styles

  return [
    lightDecls ? `:root{${lightDecls}}` : '',
    darkDecls ? `[data-theme='dark']{${darkDecls}}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}
