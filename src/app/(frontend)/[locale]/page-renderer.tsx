import type { Metadata } from 'next'

import React, { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload, TypedLocale } from 'payload'

import { LivePreviewListener } from '@/cms/components/LivePreviewListener'
import { PayloadRedirects } from '@/cms/components/PayloadRedirects'
import { generateMeta } from '@/cms/utilities/generateMeta'
import configPromise from '@/payload.config'
import type { Page } from '@/payload-types'
import { Breadcrumbs } from '@/website/components/Breadcrumbs'
import { RenderBlocks } from '@/website/blocks/RenderBlocks'
import { RenderHero } from '@/website/layout/heros/RenderHero'

import PageClient from './[slug]/page.client'

type RenderArgs = {
  locale: TypedLocale
  page: Page
  searchParams?: {
    [key: string]: string | string[] | undefined
  }
  url: string
}

export async function renderPage({ locale, page, searchParams, url }: RenderArgs) {
  const { isEnabled: draft } = await draftMode()
  const pageSlug = page.slug || ''
  const { hero, layout } = page

  return (
    <main className="pt-16 pb-24">
      <PageClient page={page} />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} locale={locale} pageSlug={pageSlug} searchParams={searchParams} />
      {page.parent && (
        <div className="container mb-8 relative z-20">
          <Breadcrumbs page={page} />
        </div>
      )}
      <RenderBlocks
        blocks={layout}
        locale={locale}
        pageSlug={pageSlug}
        searchParams={searchParams}
      />
    </main>
  )
}

export async function generatePageMetadata(page: Page | null): Promise<Metadata> {
  return generateMeta({ doc: page })
}

export const queryPageBySlug = cache(async ({ slug, locale }: { locale: TypedLocale; slug: string }) => {
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

export const queryPageByID = cache(async ({ id, locale }: { id: number; locale: TypedLocale }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  try {
    return (await payload.findByID({
      collection: 'pages',
      id,
      locale,
      depth: 1,
      draft,
      overrideAccess: draft,
    })) as Page
  } catch {
    return null
  }
})

export const getPageBySlugCached = (slug: string, locale: TypedLocale) =>
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
    { tags: [`page:${slug}`, `page:${slug}:${locale}`] },
  )

export const getPageByIDCached = (id: number, locale: TypedLocale) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })

      try {
        return (await payload.findByID({
          collection: 'pages',
          id,
          locale,
          depth: 1,
          draft: false,
          overrideAccess: false,
        })) as Page
      } catch {
        return null
      }
    },
    ['page-by-id', String(id), locale],
    { tags: [`page-id:${id}`, `page-id:${id}:${locale}`] },
  )
