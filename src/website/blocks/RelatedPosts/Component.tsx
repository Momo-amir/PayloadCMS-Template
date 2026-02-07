import clsx from 'clsx'
import React from 'react'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'

import type { Post } from '@/payload-types'

import { PostCard } from '@/website/components/Card/PostCard'
import { DEFAULT_POSTS_PARENT_PATH, getPostsParentCrumb } from '@/website/components/Breadcrumbs'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: unknown
}

export const RelatedPosts = async (props: RelatedPostsProps) => {
  const { className, docs } = props
  const t = await getTranslations()
  const parentCrumb = await getPostsParentCrumb(DEFAULT_POSTS_PARENT_PATH, t('posts'))

  return (
    <TrackImpression
      componentName={`Related Posts (${docs?.length || 0} posts)`}
      componentType="related-posts"
      className={clsx('mx-auto', className)}
    >
      <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-baseline max-sm:grid-cols-1  max-sm:gap-2">
        <div className="justify-self-start max-sm:order-2">
          {parentCrumb.url ? (
            <Link
              className="text-sm text-primary hover:underline inline-flex items-center transition-all transform duration-150 ease gap-2 group"
              href={parentCrumb.url}
            >
              <IconArrowLeft size={16} className="group-hover:-translate-x-1 duration-150 ease" />
              {t('back-to', { label: parentCrumb.label })}
            </Link>
          ) : null}
        </div>

        <div className="justify-self-center">
          <h3 className="text-2xl font-semibold mb-4">{t('related-posts')}</h3>
        </div>

        <div className="justify-self-end" aria-hidden>
          {/* spacer to balance layout */}
          <span className="invisible">spacer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <PostCard
              key={index}
              doc={doc}
              relationTo="posts"
              showCategories
              position={index + 1}
              listContext="related"
            />
          )
        })}
      </div>
    </TrackImpression>
  )
}
