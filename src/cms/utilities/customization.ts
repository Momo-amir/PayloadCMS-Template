import type { Media, Page } from '@/payload-types'
import configPromise from '@/payload.config'
import { unstable_cache } from 'next/cache'
import { getPayload, TypedLocale } from 'payload'

type MediaRef = number | Media | null | undefined
type HomePageRef = number | Page | null | undefined

export type CustomizationData = {
  faviconDark?: MediaRef
  faviconLight?: MediaRef
  homePage?: HomePageRef
  postsPage?: HomePageRef
  loginPage?: HomePageRef
  logoDark?: MediaRef
  logoLight?: MediaRef
}

export const mediaToURL = (m: MediaRef): string | undefined => {
  if (!m) return undefined
  if (typeof m === 'number') return undefined
  if (m.url) return m.url
  if (m.filename) return `/api/media/${m.filename}`
  return undefined
}

async function queryCustomization(locale?: TypedLocale): Promise<CustomizationData | null> {
  const payload = await getPayload({ config: configPromise })

  try {
    const data = await payload.findGlobal({
      slug: 'customization' as never,
      depth: 1,
      ...(locale ? { locale } : {}),
    })

    return data as CustomizationData
  } catch {
    return null
  }
}

export const getCustomization = (locale?: TypedLocale) =>
  unstable_cache(async () => queryCustomization(locale), ['customization', locale ?? 'default'], {
    tags: ['global_customization', `global_customization:${locale ?? 'default'}`],
  })

export const getPostsPagePath = (customization: CustomizationData | null): string => {
  const relation = customization?.postsPage
  if (!relation || typeof relation !== 'object') return '/posts'
  const page = relation as Page
  const breadcrumbs = page.breadcrumbs
  const lastUrl = breadcrumbs?.[breadcrumbs.length - 1]?.url
  return lastUrl || `/${page.slug}` || '/posts'
}

export const getPostsPageLabel = (customization: CustomizationData | null): string => {
  const relation = customization?.postsPage
  if (!relation || typeof relation !== 'object') return 'Posts'
  const page = relation as Page
  return page.title || 'Posts'
}

export const getLoginPagePath = (customization: CustomizationData | null): string => {
  const relation = customization?.loginPage
  if (!relation || typeof relation !== 'object') return '/login'
  const page = relation as Page
  const breadcrumbs = page.breadcrumbs
  const lastUrl = breadcrumbs?.[breadcrumbs.length - 1]?.url
  return lastUrl || (page.slug ? `/${page.slug}` : '/login')
}

export const getHomePageID = (customization: CustomizationData | null): number | null => {
  const relation = customization?.homePage

  if (!relation) return null
  if (typeof relation === 'number') return relation
  if (typeof relation === 'object' && 'id' in relation && typeof relation.id === 'number') {
    return relation.id
  }

  return null
}

export const toLogoProps = (customization: CustomizationData | null) => {
  let alt: string | undefined

  if (customization?.logoLight && typeof customization.logoLight === 'object') {
    alt = customization.logoLight.alt || undefined
  } else if (customization?.logoDark && typeof customization.logoDark === 'object') {
    alt = customization.logoDark.alt || undefined
  }

  return {
    alt,
    darkSrc:
      customization?.logoDark && typeof customization.logoDark === 'object'
        ? mediaToURL(customization.logoDark)
        : undefined,
    lightSrc:
      customization?.logoLight && typeof customization.logoLight === 'object'
        ? mediaToURL(customization.logoLight)
        : undefined,
  }
}

export const toFaviconProps = (
  customization: CustomizationData | null,
): { appleTouchIcon: string; darkHref: string; lightHref: string } => {
  const lightHref =
    (customization?.faviconLight && typeof customization.faviconLight === 'object'
      ? mediaToURL(customization.faviconLight)
      : null) || '/assets/favicon-lightmode.svg'

  const darkHref =
    (customization?.faviconDark && typeof customization.faviconDark === 'object'
      ? mediaToURL(customization.faviconDark)
      : null) || '/assets/favicon-darkmode.svg'

  return {
    lightHref,
    darkHref,
    appleTouchIcon: lightHref,
  }
}
