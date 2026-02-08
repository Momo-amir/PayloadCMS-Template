import React from 'react'
import type { Payload, TypedLocale } from 'payload'
import { Search } from '@/website/layout/search/Component'

export type SearchShellProps = {
  id?: string
  title?: string | null
  searchPath: string
  liveSearch?: boolean
  resultsCount: number
  emptyText?: string | null
  locale?: TypedLocale
  children?: React.ReactNode
}

export const SearchShell: React.FC<SearchShellProps> = (props) => {
  const { id, title, searchPath, liveSearch, resultsCount, emptyText, locale, children } =
    props

  const fallbackEmptyText = locale === 'da' ? 'Ingen resultater fundet.' : 'No results found'

  return (
    <div className="pt-24 pb-24" id={id ? `block-${id}` : undefined}>
      <div className="container mb-16">
        <div className="max-w-none text-center">
          {title && <h2 className="mb-8 lg:mb-16">{title}</h2>}

          <div className="max-w-200 mx-auto">
            <Search
              resultsCount={resultsCount}
              searchPath={searchPath}
              liveSearch={liveSearch}
            />
          </div>
        </div>
      </div>

      {resultsCount > 0 ? (
        children
      ) : (
        <div className="container">{emptyText || fallbackEmptyText}</div>
      )}
    </div>
  )
}

export type ResolveSearchPathArgs = {
  locale?: TypedLocale
  pageSlug?: string
  searchPathMode?: 'current' | 'select' | null
  searchPage?: number | string | { id?: number | string; slug?: string | null } | null
  payload: Pick<Payload, 'findByID'>
}

export const resolveSearchPath = async (args: ResolveSearchPathArgs) => {
  const { locale, pageSlug, searchPathMode, searchPage, payload } = args
  const mode = searchPathMode ?? 'current'

  let resolvedSlug: string | null = null

  if (mode === 'select' && searchPage) {
    if (typeof searchPage === 'object' && searchPage.slug) {
      resolvedSlug = searchPage.slug
    } else if (typeof searchPage === 'number' || typeof searchPage === 'string') {
      const page = await payload.findByID({
        collection: 'pages',
        id: searchPage,
        locale,
        depth: 0,
        select: { slug: true },
      })
      resolvedSlug = page?.slug ?? null
    }
  }

  if (mode === 'current' && pageSlug) {
    resolvedSlug = pageSlug
  }

  const prefix = locale && locale !== 'da' ? `/${locale}` : ''
  return `${prefix}/${resolvedSlug}`
}
