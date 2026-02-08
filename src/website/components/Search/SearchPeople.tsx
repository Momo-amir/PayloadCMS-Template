import React from 'react'
import configPromise from '@/payload.config'
import { getPayload, type Payload, type TypedLocale } from 'payload'
import { PersonCard } from '@/website/components/Card/PersonCard'
import type { Person } from '@/payload-types'
import { SearchShell, resolveSearchPath } from '@/website/components/Search/SearchShell'

export type SearchPeopleResultsArgs = {
  payload: Payload
  locale: TypedLocale
  query?: string | null
  limit: number
}

export const getSearchPeopleResults = async (args: SearchPeopleResultsArgs) => {
  const { payload, locale, query, limit } = args

  const people = await payload.find({
    collection: 'people',
    locale,
    depth: 1,
    limit,
    sort: 'firstName',
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                firstName: {
                  like: query,
                },
              },
              {
                lastName: {
                  like: query,
                },
              },
              {
                title: {
                  like: query,
                },
              },
              {
                email: {
                  like: query,
                },
              },
              {
                description: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  const peopleDocs = people.docs as Person[]

  return {
    resultsCount: people.totalDocs,
    resultsNode:
      people.totalDocs < 1 ? null : (
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {peopleDocs.map((person, index) => (
              <PersonCard key={index} doc={person} />
            ))}
          </div>
        </div>
      ),
  }
}

export type SearchPeopleProps = {
  id?: string
  title?: string | null
  searchPathMode?: 'current' | 'select' | null
  searchPage?: number | string | { id?: number | string; slug?: string | null } | null
  resultsPerPage?: number | null
  emptyText?: string | null
  locale?: TypedLocale
  pageSlug?: string
  searchParams?: {
    q?: string | string[] | null
  }
}

export const SearchPeople: React.FC<SearchPeopleProps> = async (props) => {
  const {
    id,
    title,
    searchPathMode,
    searchPage,
    resultsPerPage,
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
  const { resultsCount, resultsNode } = await getSearchPeopleResults({
    payload,
    locale,
    query,
    limit,
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
