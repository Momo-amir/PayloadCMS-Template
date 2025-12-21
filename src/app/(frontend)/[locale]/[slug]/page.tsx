import type { Metadata } from 'next'

import { PayloadRedirects } from '@/cms/components/PayloadRedirects'
import configPromise from '@/payload.config'
import { getPayload, TypedLocale } from 'payload'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import React, { cache } from 'react'
import { RenderBlocks } from '@/website/blocks/RenderBlocks'
import { RenderHero } from '@/website/layout/heros/RenderHero'
import { generateMeta } from '@/cms/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/cms/components/LivePreviewListener'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Args = {
  params: Promise<{
    slug?: string
    locale?: TypedLocale
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()

  const localeSlugs = {
    da: 'forside',
    en: 'home',
  }
  const { locale = 'da', slug = localeSlugs[locale] } = await paramsPromise
  const url = '/' + slug

  // Use cached data when not in draft/preview; bypass cache in preview to ensure freshness
  const page = draft
    ? await queryPageBySlug({ slug, locale })
    : await getPageBySlugCached(slug, locale)()

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
  const { locale = 'da', slug = locale === 'en' ? 'home' : 'forside' } = await paramsPromise
  const page = draft
    ? await queryPageBySlug({ slug, locale })
    : await getPageBySlugCached(slug, locale)()

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    locale,
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
const getPageBySlugCached = (slug: string, locale: TypedLocale) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'pages',
        locale,
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
    ['page-by-slug', slug, locale],
    { tags: [`page:${slug}:${locale}`] },
  )
