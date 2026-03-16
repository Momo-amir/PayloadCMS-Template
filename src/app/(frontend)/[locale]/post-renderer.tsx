import type { Metadata } from 'next'

import { RelatedPosts } from '@/website/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/cms/components/PayloadRedirects'
import configPromise from '@/payload.config'
import { getPayload, TypedLocale } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React, { cache } from 'react'
import RichText from '@/website/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/website/layout/heros/PostHero'
import { generateMeta } from '@/cms/utilities/generateMeta'
import PostPageClient from './post-page-client'
import { LivePreviewListener } from '@/cms/components/LivePreviewListener'
import { Breadcrumbs } from '@/website/components/Breadcrumbs'

export function renderPostContent({
  post,
  url,
  postsBasePath,
  postsParentLabel,
  draft,
}: {
  post: Post
  url: string
  postsBasePath: string
  postsParentLabel: string
  draft: boolean
}) {
  return (
    <main className="pt-16 pb-16">
      <PostPageClient post={post} />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container max-w-208 mb-8 relative z-20 mr-auto w-full">
          <Breadcrumbs
            post={post}
            includeHome={false}
            postsParentPath={postsBasePath}
            postsParentLabel={postsParentLabel}
          />
        </div>
        <div className="container">
          <RichText
            className="max-w-3xl mx-auto"
            data={post.content}
            enableGutter={false}
            postsBasePath={postsBasePath}
          />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-24 max-w-208 lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              postsBasePath={postsBasePath}
              postsParentLabel={postsParentLabel}
            />
          )}
        </div>
      </div>
    </main>
  )
}

export async function generatePostMeta(post: Post | null): Promise<Metadata> {
  return generateMeta({ doc: post })
}

export const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    locale,
    fallbackLocale: 'da',
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

export const getPostBySlugCached = (slug: string, locale?: TypedLocale) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'posts',
        draft: false,
        ...(locale ? { locale, fallbackLocale: 'da' } : {}),
        limit: 1,
        overrideAccess: false,
        pagination: false,
        where: { slug: { equals: slug } },
      })
      return result.docs?.[0] || null
    },
    ['post-by-slug', slug, locale ?? 'default'],
    { tags: [`post:${slug}${locale ? `:${locale}` : ''}`] },
  )
