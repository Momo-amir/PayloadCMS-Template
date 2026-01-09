import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@/payload-types'

// Helper to get localized paths for posts
const getLocalizedPostPaths = (slug: string): string[] => {
  return [
    `/posts/${slug}`, // Danish (default locale, no prefix)
    `/en/posts/${slug}`, // English (with prefix)
  ]
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const paths = getLocalizedPostPaths(doc.slug)

      payload.logger.info(`Revalidating post at paths: ${paths.join(', ')}`)

      // Revalidate all locale-specific paths
      paths.forEach((path) => revalidatePath(path))

      revalidateTag('posts-sitemap')

      // Invalidate cached post detail fetch for all locales
      revalidateTag(`post:${doc.slug}`)
      revalidateTag(`post:${doc.slug}:da`)
      revalidateTag(`post:${doc.slug}:en`)
    }

    // If the post was previously published, we need to revalidate the old paths
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPaths = getLocalizedPostPaths(previousDoc.slug)

      payload.logger.info(`Revalidating old post at paths: ${oldPaths.join(', ')}`)

      oldPaths.forEach((path) => revalidatePath(path))
      revalidateTag('posts-sitemap')

      // Invalidate cached post detail fetch for previous slug (all locales)
      revalidateTag(`post:${previousDoc.slug}`)
      revalidateTag(`post:${previousDoc.slug}:da`)
      revalidateTag(`post:${previousDoc.slug}:en`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    const paths = getLocalizedPostPaths(doc.slug)

    // Revalidate all locale-specific paths
    paths.forEach((path) => revalidatePath(path))
    revalidateTag('posts-sitemap')

    // Invalidate cached post detail fetch for all locales
    revalidateTag(`post:${doc.slug}`)
    revalidateTag(`post:${doc.slug}:da`)
    revalidateTag(`post:${doc.slug}:en`)
  }

  return doc
}
