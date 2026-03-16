import type { Metadata } from 'next'

import { PayloadRedirects } from '@/cms/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import type { TypedLocale } from 'payload'

import {
  generatePageMetadata,
  getPageByPathCached,
  queryPageByPath,
  renderPage,
} from '../page-renderer'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

type Args = {
  params: Promise<{
    slug?: string[]
    locale?: TypedLocale
  }>
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'da', slug } = await paramsPromise

  if (!slug?.length) {
    return <PayloadRedirects url="/" />
  }

  const path = '/' + slug.join('/')
  const searchParams = await searchParamsPromise

  const page = draft
    ? await queryPageByPath({ path, locale })
    : await getPageByPathCached(path, locale)()

  if (!page) {
    return <PayloadRedirects url={path} />
  }

  return renderPage({ page, locale, searchParams, url: path })
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'da', slug } = await paramsPromise

  if (!slug?.length) {
    return generatePageMetadata(null)
  }

  const path = '/' + slug.join('/')

  const page = draft
    ? await queryPageByPath({ path, locale })
    : await getPageByPathCached(path, locale)()

  return generatePageMetadata(page)
}
