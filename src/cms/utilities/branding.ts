import type { Branding, Media } from '@/payload-types'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type MediaRef = number | Media | null | undefined

export const mediaToURL = (m: MediaRef): string | undefined => {
  if (!m) return undefined
  if (typeof m === 'number') return undefined
  if (m?.filename) return `/media/${m.filename}`
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
  return {
    lightSrc:
      branding?.logoLight && typeof branding.logoLight === 'object'
        ? mediaToURL(branding.logoLight)
        : undefined,
    darkSrc:
      branding?.logoDark && typeof branding.logoDark === 'object'
        ? mediaToURL(branding.logoDark)
        : undefined,
    alt: branding?.logoAlt ?? undefined,
  }
}
