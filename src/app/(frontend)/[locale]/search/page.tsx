import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/website/components/CollectionArchive'
import configPromise from '@/payload.config'
import { getPayload, TypedLocale } from 'payload'
import React from 'react'
import { Search } from '@/website/layout/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/website/components/Card/PostCard'

export const dynamic = 'force-dynamic'

type Args = {
  searchParams: Promise<{
    q: string
  }>
  params: Promise<{ locale: TypedLocale }>
}
export default async function Page({ searchParams: searchParamsPromise, params }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })
  const { locale } = await params

  const posts = await payload.find({
    collection: 'search',
    locale,
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="  max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">{locale === 'da' ? 'Søg' : 'Search'}</h1>

          <div className="max-w-200 mx-auto">
            <Search resultsCount={posts.totalDocs} />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} listContext="search" />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Kollab Website Template Search`,
  }
}
