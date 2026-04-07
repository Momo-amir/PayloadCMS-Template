import type { Metadata } from 'next'
import React from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { getCustomization, getHomePageID } from '@/cms/utilities/customization'

import { generatePageMetadata, getPageByIDCached, queryPageByID, renderPage } from './page-renderer'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale?: 'da' | 'en'
  }>
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function HomePage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'da' } = await paramsPromise
  const searchParams = await searchParamsPromise

  const payload = await getPayload({ config: configPromise })
  const customization = await getCustomization(locale)()
  const homePageID = getHomePageID(customization)

  if (!homePageID) {
    return <main className="container py-24">Home page is not configured.</main>
  }

  const page = draft
    ? await queryPageByID({ id: homePageID, locale })
    : await getPageByIDCached(homePageID, locale)()

  if (!page) {
    payload.logger.warn(`Configured home page ${homePageID} was not found for locale ${locale}.`)
    return <main className="container py-24">Home page could not be loaded.</main>
  }

  return renderPage({
    page,
    locale,
    searchParams,
    url: locale === 'en' ? '/en' : '/',
  })
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'da' } = await paramsPromise
  const customization = await getCustomization(locale)()
  const homePageID = getHomePageID(customization)

  if (!homePageID) {
    return generatePageMetadata(null)
  }

  const page = draft
    ? await queryPageByID({ id: homePageID, locale })
    : await getPageByIDCached(homePageID, locale)()

  return generatePageMetadata(page)
}
