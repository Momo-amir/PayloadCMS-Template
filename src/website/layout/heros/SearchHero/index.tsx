import React from 'react'

import type { Page } from '@/payload-types'
import type { TypedLocale } from 'payload'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import RichText from '@/website/components/RichText'
import { SearchInput } from '@/website/components/Search/Input'
import { querySearchResults, type SearchCollection } from '@/website/components/Search/query'
import { SearchPaginationControls } from '@/website/components/Search/PaginationControls.client'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { PostCard } from '@/website/components/Card/PostCard'
import { PersonCard } from '@/website/components/Card/PersonCard'
import { STAGGER_GRID_CLASS, getStaggerItemProps } from '@/website/utilities/stagger'

type SearchHeroProps = Page['hero'] & {
  resultCollection?: 'posts' | 'people' | null
  resultsPerPage?: number | null
  postCategories?: Array<number | string | { id?: number | string | null }> | null
  emptyText?: string | null
  locale?: TypedLocale
  pageSlug?: string
  searchParams?: {
    q?: string | string[] | null
    page?: string | string[] | null
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
  const rawPage = searchParams?.page
  const pageParam = Array.isArray(rawPage) ? rawPage[0] : rawPage
  const requestedPageRaw = Number.parseInt(pageParam || '1', 10)
  const requestedPage = Number.isFinite(requestedPageRaw) ? requestedPageRaw : 1

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
  const fallbackEmptyText =
    emptyText || (locale === 'da' ? 'Ingen resultater fundet.' : 'No results found')

  const { totalDocs, totalPages, currentPage, postDocs, peopleDocs } = await querySearchResults({
    payload,
    locale,
    query: normalizedQuery,
    limit,
    page: requestedPage,
    collection,
    categoryIDs,
  })
  const resultsCount = totalDocs
  const resultsAnimationKey = `search-${collection}-${normalizedQuery || ''}-${currentPage}`

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
          <>
            <div className="container">
              <div
                key={resultsAnimationKey}
                className={`${STAGGER_GRID_CLASS} grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`}
              >
                {collection === 'posts'
                  ? postDocs.map((post, index) => (
                      <div key={`post-${post.slug}-${index}`} {...getStaggerItemProps(index)}>
                        <PostCard
                          className="h-full"
                          doc={post}
                          relationTo="posts"
                          showCategories
                          position={(currentPage - 1) * limit + index + 1}
                          listContext="search"
                        />
                      </div>
                    ))
                  : peopleDocs.map((person, index) => (
                      <div key={`person-${person.id}`} {...getStaggerItemProps(index)}>
                        <PersonCard doc={person} />
                      </div>
                    ))}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="container mt-10">
                <SearchPaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchPath={searchPath}
                  query={normalizedQuery}
                />
              </div>
            )}
          </>
        )}
      </div>
    </TrackImpression>
  )
}
