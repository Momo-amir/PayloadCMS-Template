import type { Page } from '@/payload-types'

export const getLocalizedPathsForPage = (
  page: Page,
  homePageId: number | string | null,
): string[] => {
  if (!page.slug) return []

  if (homePageId !== null && String(page.id) === String(homePageId)) {
    return ['/', '/en']
  }

  return [`/${page.slug}`, `/en/${page.slug}`]
}
