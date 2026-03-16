import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@/payload-types'
import { getPostsPagePath } from '@/cms/utilities/customization'

const getLocalizedPostPaths = (slug: string, postsBasePath: string): string[] => {
  return [
    `${postsBasePath}/${slug}`, // Danish (default locale, no prefix)
    `/en${postsBasePath}/${slug}`, // English (with prefix)
  ]
}

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const customizationData = await payload.findGlobal({
      slug: 'customization' as never,
      depth: 1,
    })
    const postsBasePath = getPostsPagePath(customizationData as never)

    if (doc._status === 'published') {
      const paths = getLocalizedPostPaths(doc.slug, postsBasePath)

      payload.logger.info(`Revalidating post at paths: ${paths.join(', ')}`)

      // Revalidate all locale-specific paths
      paths.forEach((path) => revalidatePath(path))

      revalidateTag('posts-sitemap', 'max')

      // Invalidate cached post detail fetch for all locales
      revalidateTag(`post:${doc.slug}`, 'max')
      revalidateTag(`post:${doc.slug}:da`, 'max')
      revalidateTag(`post:${doc.slug}:en`, 'max')
    }

    // If the post was previously published, we need to revalidate the old paths
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPaths = getLocalizedPostPaths(previousDoc.slug, postsBasePath)

      payload.logger.info(`Revalidating old post at paths: ${oldPaths.join(', ')}`)

      oldPaths.forEach((path) => revalidatePath(path))
      revalidateTag('posts-sitemap', 'max')

      // Invalidate cached post detail fetch for previous slug (all locales)
      revalidateTag(`post:${previousDoc.slug}`, 'max')
      revalidateTag(`post:${previousDoc.slug}:da`, 'max')
      revalidateTag(`post:${previousDoc.slug}:en`, 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate && doc?.slug) {
    const customizationData = await payload.findGlobal({
      slug: 'customization' as never,
      depth: 1,
    })
    const postsBasePath = getPostsPagePath(customizationData as never)
    const paths = getLocalizedPostPaths(doc.slug, postsBasePath)

    // Revalidate all locale-specific paths
    paths.forEach((path) => revalidatePath(path))
    revalidateTag('posts-sitemap', 'max')

    // Invalidate cached post detail fetch for all locales
    revalidateTag(`post:${doc.slug}`, 'max')
    revalidateTag(`post:${doc.slug}:da`, 'max')
    revalidateTag(`post:${doc.slug}:en`, 'max')
  }

  return doc
}
