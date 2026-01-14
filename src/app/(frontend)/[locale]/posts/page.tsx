import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/website/components/CollectionArchive'
import { PageRange } from '@/website/components/PageRange'
import { Pagination } from '@/website/components/Pagination/index'
import configPromise from '@/payload.config'
import { getPayload, TypedLocale } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'
export const revalidate = 600

type Args = {
  params: {
    locale?: TypedLocale
  }
}

export default async function Page({ params }: Args) {
  const { locale = 'da' } = params

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    locale,
    fallbackLocale: 'da',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })
  const t = await getTranslations()

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="max-w-none">
          <h1>{t('post')}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Kollab Website Template Posts`,
  }
}
