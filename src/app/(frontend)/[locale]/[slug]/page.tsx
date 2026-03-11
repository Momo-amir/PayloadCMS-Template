import type { Metadata } from 'next'

import { PayloadRedirects } from '@/cms/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import type { TypedLocale } from 'payload'

import {
  generatePageMetadata,
  getPageBySlugCached,
  queryPageBySlug,
  renderPage,
} from '../page-renderer'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Args = {
  params: Promise<{
    slug?: string
    locale?: TypedLocale
  }>
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'da', slug } = await paramsPromise

  if (!slug) {
    return <PayloadRedirects url="/" />
  }

  const url = '/' + slug
  const searchParams = await searchParamsPromise

  const page = draft
    ? await queryPageBySlug({ slug, locale })
    : await getPageBySlugCached(slug, locale)()

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return renderPage({ page, locale, searchParams, url })
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'da', slug } = await paramsPromise

  if (!slug) {
    return generatePageMetadata(null)
  }

  const page = draft
    ? await queryPageBySlug({ slug, locale })
    : await getPageBySlugCached(slug, locale)()

  return generatePageMetadata(page)
}
