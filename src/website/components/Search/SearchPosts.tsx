import React from 'react'
import configPromise from '@/payload.config'
import { getPayload, type Payload, type TypedLocale } from 'payload'
import { CollectionArchive } from '@/website/components/CollectionArchive'
import type { CardPostData } from '@/website/components/Card/PostCard'
import { SearchShell, resolveSearchPath } from '@/website/components/Search/SearchShell'

export type SearchPostsResultsArgs = {
  payload: Payload
  locale: TypedLocale
  query?: string | null
  limit: number
  categoryIDs: string[]
}

export const getSearchPostsResults = async (args: SearchPostsResultsArgs) => {
  const { payload, locale, query, limit, categoryIDs } = args

  const posts = await payload.find({
    collection: 'search',
    locale,
    fallbackLocale: 'da',
    depth: 1,
    limit,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    pagination: false,
    ...(query
      ? {
          where: {
            and: [
              ...(categoryIDs.length > 0
                ? [
                    {
                      'categories.categoryID': {
                        in: categoryIDs,
                      },
                    },
                  ]
                : []),
              {
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
            ],
          },
        }
      : categoryIDs.length > 0
        ? {
            where: {
              'categories.categoryID': {
                in: categoryIDs,
              },
            },
          }
        : {}),
  })

  return {
    resultsCount: posts.totalDocs,
    resultsNode:
      posts.totalDocs < 1 ? null : (
        <CollectionArchive posts={posts.docs as CardPostData[]} listContext="search" />
      ),
  }
}

export type SearchPostsProps = {
  id?: string
  title?: string | null
  searchPathMode?: 'current' | 'select' | null
  searchPage?: number | string | { id?: number | string; slug?: string | null } | null
  resultsPerPage?: number | null
  postCategories?: Array<number | string | { id?: number | string | null }> | null
  emptyText?: string | null
  locale?: TypedLocale
  pageSlug?: string
  searchParams?: {
    q?: string | string[] | null
  }
}

export const SearchPosts: React.FC<SearchPostsProps> = async (props) => {
  const {
    id,
    title,
    searchPathMode,
    searchPage,
    resultsPerPage,
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
  const categoryIDs =
    postCategories
      ?.map((category) => {
        if (typeof category === 'object' && category?.id) return String(category.id)
        if (typeof category === 'number' || typeof category === 'string') return String(category)
        return null
      })
      .filter((id): id is string => id !== null) || []

  const { resultsCount, resultsNode } = await getSearchPostsResults({
    payload,
    locale,
    query,
    limit,
    categoryIDs,
  })

  return (
    <SearchShell
      id={id}
      title={title}
      locale={locale}
      searchPath={searchPath}
      liveSearch={liveSearch}
      resultsCount={resultsCount}
      emptyText={emptyText}
    >
      {resultsNode}
    </SearchShell>
  )
}
