import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '@/payload-types'
import { getCustomization, getHomePageID } from '@/cms/utilities/customization'
import { getLocalizedPathsForPage } from '@/utils/paths'

const getRevalidationPaths = async (page: Page, locale?: 'da' | 'en') => {
  const customization = await getCustomization(locale)()
  return getLocalizedPathsForPage(page, getHomePageID(customization))
}

const getPageLocale = (page: Page): 'da' | 'en' | undefined =>
  (page as Page & { locale?: 'da' | 'en' }).locale

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const paths = await getRevalidationPaths(doc, getPageLocale(doc))

      payload.logger.info(`Revalidating page at paths: ${paths.join(', ')}`)

      // Revalidate all locale-specific paths
      paths.forEach((path) => revalidatePath(path))

      revalidateTag('pages-sitemap', 'max')

      // Invalidate cached page detail fetch for all locales
      revalidateTag(`page:${doc.slug}`, 'max')
      revalidateTag(`page:${doc.slug}:da`, 'max')
      revalidateTag(`page:${doc.slug}:en`, 'max')
      revalidateTag(`page-id:${doc.id}`, 'max')
      revalidateTag(`page-id:${doc.id}:da`, 'max')
      revalidateTag(`page-id:${doc.id}:en`, 'max')
    }

    // If the page was previously published, we need to revalidate the old paths
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPaths = await getRevalidationPaths(
        previousDoc,
        getPageLocale(previousDoc),
      )

      payload.logger.info(`Revalidating old page at paths: ${oldPaths.join(', ')}`)

      oldPaths.forEach((path) => revalidatePath(path))
      revalidateTag('pages-sitemap', 'max')

      // Invalidate cached page detail fetch for previous slug (all locales)
      revalidateTag(`page:${previousDoc.slug}`, 'max')
      revalidateTag(`page:${previousDoc.slug}:da`, 'max')
      revalidateTag(`page:${previousDoc.slug}:en`, 'max')
      revalidateTag(`page-id:${previousDoc.id}`, 'max')
      revalidateTag(`page-id:${previousDoc.id}:da`, 'max')
      revalidateTag(`page-id:${previousDoc.id}:en`, 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    const paths = await getRevalidationPaths(doc, getPageLocale(doc))

    // Revalidate all locale-specific paths
    paths.forEach((path) => revalidatePath(path))
    revalidateTag('pages-sitemap', 'max')

    // Invalidate cached page detail fetch for all locales
    revalidateTag(`page:${doc.slug}`, 'max')
    revalidateTag(`page:${doc.slug}:da`, 'max')
    revalidateTag(`page:${doc.slug}:en`, 'max')
    revalidateTag(`page-id:${doc.id}`, 'max')
    revalidateTag(`page-id:${doc.id}:da`, 'max')
    revalidateTag(`page-id:${doc.id}:en`, 'max')
  }

  return doc
}
