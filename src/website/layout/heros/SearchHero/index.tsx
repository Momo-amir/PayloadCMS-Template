import React from 'react'

import type { Page } from '@/payload-types'
import type { TypedLocale } from 'payload'
import configPromise from '@/payload.config'
import { getPayload } from 'payload'
import RichText from '@/website/components/RichText'
import { Search } from '@/website/layout/search/Component'
import { resolveSearchPath } from '@/website/components/Search/SearchShell'
import {
  getSearchPostsResults,
  type SearchPostsResultsArgs,
} from '@/website/components/Search/SearchPosts'
import {
  getSearchPeopleResults,
  type SearchPeopleResultsArgs,
} from '@/website/components/Search/SearchPeople'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

type SearchHeroProps = Page['hero'] & {
  searchPathMode?: 'current' | 'select' | null
  searchPage?: number | string | { id?: number | string; slug?: string | null } | null
  resultsPerPage?: number | null
  resultCollection?: 'posts' | 'people' | null
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
    searchPathMode,
    searchPage,
    resultsPerPage,
    resultCollection,
    postCategories,
    emptyText,
    locale: localeFromProps,
    pageSlug,
    searchParams,
  } = props

  const locale = localeFromProps ?? 'da'
  const payload = await getPayload({ config: configPromise })

  const searchPath = await resolveSearchPath({
    locale,
    pageSlug,
    searchPathMode,
    searchPage,
    payload,
  })
  const liveSearch = (searchPathMode ?? 'current') === 'current'

  const rawQuery = searchParams?.q
  const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery

  const limit = resultsPerPage || 12
  const collectionType = resultCollection ?? 'posts'
  const categoryIDs =
    postCategories
      ?.map((category) => {
        if (typeof category === 'object' && category?.id) return String(category.id)
        if (typeof category === 'number' || typeof category === 'string') return String(category)
        return null
      })
      .filter((id): id is string => id !== null) || []

  const fallbackEmptyText = locale === 'da' ? 'Ingen resultater fundet.' : 'No results found'

  let resultsCount = 0
  let resultsNode: React.ReactNode = null

  if (collectionType === 'people') {
    const { resultsCount: count, resultsNode: node } = await getSearchPeopleResults({
      payload,
      locale,
      query,
      limit,
    } satisfies SearchPeopleResultsArgs)
    resultsCount = count
    resultsNode = node
  } else {
    const { resultsCount: count, resultsNode: node } = await getSearchPostsResults({
      payload,
      locale,
      query,
      limit,
      categoryIDs,
    } satisfies SearchPostsResultsArgs)
    resultsCount = count
    resultsNode = node
  }

  return (
    <TrackImpression componentName="Search Hero" componentType="searh_hero">
      <div className="relative mb-8 -mt-[9.4rem]">
        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-200 mx-auto">
            {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

            <div className="my-6">
              <Search resultsCount={resultsCount} searchPath={searchPath} liveSearch={liveSearch} />
            </div>
          </div>
        </div>
      </div>

      <div className="pb-24">
        {resultsCount < 1 ? (
          <div className="container">{emptyText || fallbackEmptyText}</div>
        ) : (
          resultsNode
        )}
      </div>
    </TrackImpression>
  )
}
