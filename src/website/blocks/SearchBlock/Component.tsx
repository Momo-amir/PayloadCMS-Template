import React from 'react'
import type { TypedLocale } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { Search } from '@/website/layout/search/Component'
import { resolveSearchPath } from '@/website/components/Search/SearchShell'

type SearchBlockProps = {
  id?: string
  title?: string | null
  description?: string | null
  searchPage?: number | string | { id?: number | string; slug?: string | null } | null
  locale?: TypedLocale
  pageSlug?: string
}

export const SearchBlock: React.FC<SearchBlockProps> = async (props) => {
  const { id, title, description, searchPage, locale, pageSlug } = props
  const payload = await getPayload({ config: configPromise })

  const searchPath = await resolveSearchPath({
    locale,
    pageSlug,
    searchPathMode: 'select',
    searchPage,
    payload,
  })

  return (
    <div className="my-16" id={id ? `block-${id}` : undefined}>
      <div className="container">
        <div className="max-w-200 mx-auto text-center">
          {title && <h2 className="mb-4">{title}</h2>}
          {description && <p className="mb-6 text-muted-foreground">{description}</p>}
          <Search searchPath={searchPath} liveSearch={false} />
        </div>
      </div>
    </div>
  )
}
