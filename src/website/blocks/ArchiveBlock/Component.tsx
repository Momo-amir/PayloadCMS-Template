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
  getPaginationData,
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
  const requestedPage = getPageFromSearchParams(searchParams)

  let posts: Post[] = []
  let result = null

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category: any) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    result = await payload.find({
      collection: 'posts',
      locale,
      fallbackLocale: 'da',
      depth: 1,
      limit,
      page: enablePagination ? requestedPage : undefined,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = result.docs
  }

  const pagination = getPaginationData(result, enablePagination, populateBy)

  return (
    <div className="my-16" id={`block-${id}`}>
      <TrackImpression componentName="Archive Block" componentType="archive">
        {introContent && (
          <div className="container mb-16">
            <RichText className="ms-0" data={introContent} enableGutter={false} />
          </div>
        )}
        {enableCategoryFilter ? (
          <ArchiveCategoryFilter posts={posts} />
        ) : (
          <CollectionArchive posts={posts} />
        )}
        {pagination.shouldShow && (
          <div className="container">
            <ArchivePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              scrollTargetId={`block-${id}`}
            />
          </div>
        )}
      </TrackImpression>
    </div>
  )
}
