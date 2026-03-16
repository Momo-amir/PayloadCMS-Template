import type { Page } from '@/payload-types'

export const getPagePath = (page: Page): string => {
  const breadcrumbs = page.breadcrumbs
  const lastUrl = breadcrumbs?.[breadcrumbs.length - 1]?.url
  return lastUrl || '/' + page.slug
}

export const getLocalizedPathsForPage = (
  page: Page,
  homePageId: number | string | null,
): string[] => {
  if (!page.slug) return []

  if (homePageId !== null && String(page.id) === String(homePageId)) {
    return ['/', '/en']
  }

  const pagePath = getPagePath(page)
  return [pagePath, `/en${pagePath}`]
}
