import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '@/payload-types'

// Helper to get localized paths for revalidation
const getLocalizedPaths = (slug: string): string[] => {
  const paths: string[] = []

  // Handle home page: accessible at root for default locale and /en for English
  if (slug === 'home') {
    paths.push('/') // Danish default at root
    paths.push('/en') // English at /en
  } else {
    // For other pages, revalidate both locale paths
    paths.push(`/${slug}`) // Danish (default locale, no prefix)
    paths.push(`/en/${slug}`) // English (with prefix)
  }

  return paths
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const paths = getLocalizedPaths(doc.slug)

      payload.logger.info(`Revalidating page at paths: ${paths.join(', ')}`)

      // Revalidate all locale-specific paths
      paths.forEach((path) => revalidatePath(path))

      revalidateTag('pages-sitemap')

      // Invalidate cached page detail fetch for all locales
      revalidateTag(`page:${doc.slug}`)
      revalidateTag(`page:${doc.slug}:da`)
      revalidateTag(`page:${doc.slug}:en`)
    }

    // If the page was previously published, we need to revalidate the old paths
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPaths = getLocalizedPaths(previousDoc.slug)

      payload.logger.info(`Revalidating old page at paths: ${oldPaths.join(', ')}`)

      oldPaths.forEach((path) => revalidatePath(path))
      revalidateTag('pages-sitemap')

      // Invalidate cached page detail fetch for previous slug (all locales)
      revalidateTag(`page:${previousDoc.slug}`)
      revalidateTag(`page:${previousDoc.slug}:da`)
      revalidateTag(`page:${previousDoc.slug}:en`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    const paths = getLocalizedPaths(doc.slug)

    // Revalidate all locale-specific paths
    paths.forEach((path) => revalidatePath(path))
    revalidateTag('pages-sitemap')

    // Invalidate cached page detail fetch for all locales
    revalidateTag(`page:${doc.slug}`)
    revalidateTag(`page:${doc.slug}:da`)
    revalidateTag(`page:${doc.slug}:en`)
  }

  return doc
}
