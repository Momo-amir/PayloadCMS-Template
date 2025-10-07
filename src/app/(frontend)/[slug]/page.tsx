import type { Metadata } from 'next'

import { PayloadRedirects } from '@/cms/components/PayloadRedirects'
import configPromise from '@/payload.config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React, { cache } from 'react'
import { homeStatic } from '@/cms/endpoints/seed/home-static'
import { RenderBlocks } from '@/website/blocks/RenderBlocks'
import { RenderHero } from '@/website/layout/heros/RenderHero'
import { generateMeta } from '@/cms/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/cms/components/LivePreviewListener'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  // Use cached data when not in draft/preview; bypass cache in preview to ensure freshness
  page = draft ? await queryPageBySlug({ slug }) : await getPageBySlugCached(slug)()

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <main className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const page = draft ? await queryPageBySlug({ slug }) : await getPageBySlugCached(slug)()

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

// Cached getter for non-preview usage; tag per page slug so hooks can revalidate precisely
const getPageBySlugCached = (slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'pages',
        draft: false,
        limit: 1,
        pagination: false,
        overrideAccess: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      })
      return result.docs?.[0] || null
    },
    ['page-by-slug', slug],
    { tags: [`page:${slug}`] },
  )
