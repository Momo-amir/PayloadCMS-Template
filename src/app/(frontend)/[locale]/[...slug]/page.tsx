import type { Metadata } from 'next'

import { PayloadRedirects } from '@/cms/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import type { TypedLocale } from 'payload'

import {
  generatePageMetadata,
  getPageByPathCached,
  queryPageByPath,
  renderPage,
} from '../page-renderer'
import { getCustomization, getPostsPageLabel, getPostsPagePath } from '@/cms/utilities/customization'
import {
  getPostBySlugCached,
  queryPostBySlug,
  renderPostContent,
} from '../post-renderer'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Args = {
  params: Promise<{
    slug?: string[]
    locale?: TypedLocale
  }>
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'da', slug } = await paramsPromise

  if (!slug?.length) {
    return <PayloadRedirects url="/" />
  }

  const path = '/' + slug.join('/')
  const searchParams = await searchParamsPromise

  const page = draft
    ? await queryPageByPath({ path, locale })
    : await getPageByPathCached(path, locale)()

  if (page) {
    return renderPage({ page, locale, searchParams, url: path })
  }

  // Check if this path matches {postsBasePath}/{postSlug}
  if (slug.length >= 2) {
    const customization = await getCustomization(locale)()
    const postsBasePath = getPostsPagePath(customization)
    const postsParentLabel = getPostsPageLabel(customization)
    const parentPath = '/' + slug.slice(0, -1).join('/')
    const postSlug = slug[slug.length - 1]!

    if (parentPath === postsBasePath) {
      const post = draft
        ? await queryPostBySlug({ slug: postSlug, locale })
        : await getPostBySlugCached(postSlug, locale)()

      if (post) {
        return renderPostContent({ post, url: path, postsBasePath, postsParentLabel, draft })
      }
    }
  }

  return <PayloadRedirects url={path} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'da', slug } = await paramsPromise

  if (!slug?.length) {
    return generatePageMetadata(null)
  }

  const path = '/' + slug.join('/')

  const page = draft
    ? await queryPageByPath({ path, locale })
    : await getPageByPathCached(path, locale)()

  if (page) return generatePageMetadata(page)

  if (slug.length >= 2) {
    const customization = await getCustomization(locale)()
    const postsBasePath = getPostsPagePath(customization)
    const parentPath = '/' + slug.slice(0, -1).join('/')
    const postSlug = slug[slug.length - 1]!

    if (parentPath === postsBasePath) {
      const { generatePostMeta } = await import('../post-renderer')
      const post = draft
        ? await queryPostBySlug({ slug: postSlug, locale })
        : await getPostBySlugCached(postSlug, locale)()

      if (post) return generatePostMeta(post)
    }
  }

  return generatePageMetadata(null)
}
