import React from 'react'

import type { Page } from '@/payload-types'
import type { TypedLocale } from 'payload'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import RichText from '@/website/components/RichText'
import { SearchInput } from '@/website/components/Search/Input'
import { querySearchResults, type SearchCollection } from '@/website/components/Search/query'
import { SearchResultsPaginated } from '@/website/components/Search/ResultsPaginated.client'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

type SearchHeroProps = Page['hero'] & {
  resultCollection?: 'posts' | 'people' | null
  resultsPerPage?: number | null
  postCategories?: Array<number | string | { id?: number | string | null }> | null
  emptyText?: string | null
  locale?: TypedLocale
  pageSlug?: string
  searchParams?: {
    q?: string | string[] | null
  }
}

export const SearchHero: React.FC<SearchHeroProps> = async (props) => {
  const {
    richText,
    resultCollection,
    resultsPerPage,
    postCategories,
    emptyText,
    locale: localeFromProps,
    pageSlug,
    searchParams,
  } = props

  const locale = localeFromProps ?? 'da'
  const payload = await getPayload({ config: configPromise })
  const prefix = locale !== 'da' ? `/${locale}` : ''
  const searchPath = `${prefix}/${pageSlug ?? ''}`
  const liveSearch = true

  const rawQuery = searchParams?.q
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery
  const normalizedQuery = query?.trim()

  const limit = Math.max(1, resultsPerPage || 12)
  const collection: SearchCollection = resultCollection ?? 'posts'
  const categoryIDs =
    postCategories
      ?.map((category) => {
        if (typeof category === 'object' && category?.id) return String(category.id)
        if (typeof category === 'number' || typeof category === 'string') return String(category)
        return null
      })
      .filter((id): id is string => id !== null) || []
  const fallbackEmptyText = emptyText || (locale === 'da' ? 'Ingen resultater fundet.' : 'No results found')

  const { totalDocs, postDocs, peopleDocs } = await querySearchResults({
    payload,
    locale,
    query: normalizedQuery,
    limit,
    collection,
    categoryIDs,
  })
  const resultsCount = totalDocs

  return (
    <TrackImpression componentName="Search Hero" componentType="searh_hero">
      <div className="relative mb-8 -mt-[9.4rem]">
        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-200 mx-auto">
            {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

            <div className="my-6">
              <SearchInput
                resultsCount={resultsCount}
                searchPath={searchPath}
                liveSearch={liveSearch}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pb-24">
        {resultsCount < 1 ? (
          <div className="container">{fallbackEmptyText}</div>
        ) : (
          <SearchResultsPaginated
            collection={collection}
            posts={postDocs}
            people={peopleDocs}
            perPage={limit}
            queryKey={`${normalizedQuery || ''}:${collection}:${categoryIDs.join(',')}`}
          />
        )}
      </div>
    </TrackImpression>
  )
}
