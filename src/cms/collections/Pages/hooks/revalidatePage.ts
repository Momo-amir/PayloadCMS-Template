import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '@/payload-types'
import { getCustomization, getHomePageID } from '@/cms/utilities/customization'
import { getLocalizedPathsForPage, getPagePath } from '@/utils/paths'

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
      const pagePath = getPagePath(doc)

      payload.logger.info(`Revalidating page at paths: ${paths.join(', ')}`)

      paths.forEach((path) => revalidatePath(path))

      revalidateTag('pages-sitemap', 'max')

      revalidateTag(`page-path:${pagePath}`, 'max')
      revalidateTag(`page-path:${pagePath}:da`, 'max')
      revalidateTag(`page-path:${pagePath}:en`, 'max')
      revalidateTag(`page-id:${doc.id}`, 'max')
      revalidateTag(`page-id:${doc.id}:da`, 'max')
      revalidateTag(`page-id:${doc.id}:en`, 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPaths = await getRevalidationPaths(previousDoc, getPageLocale(previousDoc))
      const previousPagePath = getPagePath(previousDoc)

      payload.logger.info(`Revalidating old page at paths: ${oldPaths.join(', ')}`)

      oldPaths.forEach((path) => revalidatePath(path))
      revalidateTag('pages-sitemap', 'max')

      revalidateTag(`page-path:${previousPagePath}`, 'max')
      revalidateTag(`page-path:${previousPagePath}:da`, 'max')
      revalidateTag(`page-path:${previousPagePath}:en`, 'max')
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
    const pagePath = getPagePath(doc)

    paths.forEach((path) => revalidatePath(path))
    revalidateTag('pages-sitemap', 'max')

    revalidateTag(`page-path:${pagePath}`, 'max')
    revalidateTag(`page-path:${pagePath}:da`, 'max')
    revalidateTag(`page-path:${pagePath}:en`, 'max')
    revalidateTag(`page-id:${doc.id}`, 'max')
    revalidateTag(`page-id:${doc.id}:da`, 'max')
    revalidateTag(`page-id:${doc.id}:en`, 'max')
  }

  return doc
}
