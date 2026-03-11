import type { Branding, Media } from '@/payload-types'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type MediaRef = number | Media | null | undefined

export const mediaToURL = (m: MediaRef): string | undefined => {
  if (!m) return undefined
  if (typeof m === 'number') return undefined
  if (m.url) return m.url
  if (m.filename) return `/api/media/${m.filename}`
  return undefined
}

export const getBranding = unstable_cache(
  async (): Promise<Branding | null> => {
    const payload = await getPayload({ config: configPromise })
    try {
      const data = (await payload.findGlobal({ slug: 'branding', depth: 1 })) as Branding
      return data
    } catch {
      return null
    }
  },
  ['branding'],
  { tags: ['global_branding'] },
)

export const toLogoProps = (branding: Branding | null) => {
  // Get alt text from the media item itself, prioritizing logoLight
  let alt: string | undefined = undefined

  if (branding?.logoLight && typeof branding.logoLight === 'object') {
    alt = branding.logoLight.alt || undefined
  } else if (branding?.logoDark && typeof branding.logoDark === 'object') {
    alt = branding.logoDark.alt || undefined
  }

  return {
    lightSrc:
      branding?.logoLight && typeof branding.logoLight === 'object'
        ? mediaToURL(branding.logoLight)
        : undefined,
    darkSrc:
      branding?.logoDark && typeof branding.logoDark === 'object'
        ? mediaToURL(branding.logoDark)
        : undefined,
    alt,
  }
}

export const toFaviconProps = (
  branding: Branding | null,
): { lightHref: string; darkHref: string; appleTouchIcon: string } => {
  const lightHref =
    (branding?.faviconLight && typeof branding.faviconLight === 'object'
      ? mediaToURL(branding.faviconLight)
      : null) || '/assets/favicon-lightmode.svg'

  const darkHref =
    (branding?.faviconDark && typeof branding.faviconDark === 'object'
      ? mediaToURL(branding.faviconDark)
      : null) || '/assets/favicon-darkmode.svg'

  // Prefer PNG for apple-touch-icon, fallback to light favicon
  const appleTouchIcon = lightHref.endsWith('.png') ? lightHref : lightHref

  return {
    lightHref,
    darkHref,
    appleTouchIcon,
  }
}
