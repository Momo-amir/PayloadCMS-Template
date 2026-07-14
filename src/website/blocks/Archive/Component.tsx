import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@/payload.config'
import { getPayload, type TypedLocale } from 'payload'
import React from 'react'
import RichText from '@/website/components/RichText'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { getLocale } from 'next-intl/server'

import { CollectionArchive } from '@/website/components/CollectionArchive'
import { ArchiveCategoryFilter } from './ArchiveCategoryFilter.client'
import { ArchivePagination } from '@/website/components/ArchivePagination'
import {
  getPageFromSearchParams,
  getCatsFromSearchParams,
  getPaginationData,
  getPaginationScopeIds,
  type PaginationProps,
} from '@/website/utilities/pagination'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  } & PaginationProps
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    enableCategoryFilter,
    enablePagination,
    searchParams,
  } = props

  const limit = limitFromProps || 10
  const locale = (await getLocale()) as TypedLocale
  const { pageParamKey, anchorId, catParamKey } = getPaginationScopeIds('archive', id)
  const requestedPage = getPageFromSearchParams(searchParams, pageParamKey)
  const activeCatSlugs = enableCategoryFilter
    ? getCatsFromSearchParams(searchParams, catParamKey)
    : []

  let posts: Post[] = []
  let result = null
  let filterCategories: { id: string; title: string; slug: string }[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category: any) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    // Build where clause combining block-level category restriction and active filter
    const whereConditions: any[] = []

    if (flattenedCategories && flattenedCategories.length > 0) {
      whereConditions.push({ categories: { in: flattenedCategories } })
    }

    if (activeCatSlugs.length > 0) {
      whereConditions.push({ 'categories.slug': { in: activeCatSlugs } })
    }

    result = await payload.find({
      collection: 'posts',
      locale,
      fallbackLocale: 'da',
      depth: 1,
      limit,
      page: enablePagination ? requestedPage : undefined,
      ...(whereConditions.length > 0
        ? { where: whereConditions.length === 1 ? whereConditions[0] : { and: whereConditions } }
        : {}),
    })

    posts = result.docs

    if (enableCategoryFilter) {
      // Fetch the categories available for this block (restricted by block config or all)
      const catResult = await payload.find({
        collection: 'categories',
        locale,
        fallbackLocale: 'da',
        depth: 0,
        limit: 100,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? { where: { id: { in: flattenedCategories } } }
          : {}),
      })
      filterCategories = catResult.docs
        .filter((cat) => cat.slug)
        .map((cat) => ({ id: String(cat.id), title: cat.title, slug: cat.slug as string }))
    }
  }

  const pagination = getPaginationData(result, enablePagination, populateBy)

  return (
    <div className="my-16" id={anchorId} data-block-id={id ? `block-${id}` : undefined}>
      <TrackImpression componentName="Archive Block" componentType="archive">
        {introContent && (
          <div className="container mb-16">
            <RichText className="ms-0" data={introContent} enableGutter={false} />
          </div>
        )}
        {enableCategoryFilter ? (
          <ArchiveCategoryFilter
            posts={posts}
            categories={filterCategories}
            activeCatSlugs={activeCatSlugs}
            catParamKey={catParamKey}
            pageParamKey={pageParamKey}
            animationKey={`${pagination.currentPage}-${activeCatSlugs.join(',')}`}
          />
        ) : (
          <CollectionArchive posts={posts} animateOnLoad animationKey={pagination.currentPage} />
        )}
        {pagination.shouldShow && (
          <div className="container">
            <ArchivePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              scrollTargetId={anchorId}
              pageParamKey={pageParamKey}
            />
          </div>
        )}
      </TrackImpression>
    </div>
  )
}
