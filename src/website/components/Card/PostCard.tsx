'use client'
import { cn } from '@/cms/utilities/ui'
import useClickableCard from '@/cms/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post, Category } from '@/payload-types'

import { Media } from '@/website/components/Media'
import {
  Card as CardComponent,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/website/components/elements/card'
import { trackPostCardClick } from '@/cms/utilities/analytics'
import { usePrivacy } from '@/providers/Privacy'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const PostCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
  position?: number
  listContext?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { cookieConsent } = usePrivacy()
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
    position,
    listContext = 'archive',
  } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  const handleClick = () => {
    if (cookieConsent && title && slug) {
      const categoryNames = categories
        ?.filter((cat): cat is Category => typeof cat === 'object' && 'title' in cat)
        .map((cat) => cat.title)

      trackPostCardClick(title, slug, categoryNames, position, listContext)
    }
  }

  return (
    <article
      ref={card.ref}
      className={cn('group h-full hover:cursor-pointer', className)}
      onClick={handleClick}
    >
      <CardComponent
        className={cn(
          'h-full flex flex-col transition hover:shadow-md bg-base text-primary border-border',
        )}
      >
        <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
          {!metaImage && (
            <div className="flex h-full w-full items-center justify-center text-sm text-white bg-accent">
              No image
            </div>
          )}
          {metaImage && typeof metaImage !== 'string' && (
            <Media resource={metaImage} fill imgClassName="object-cover" />
          )}

          {showCategories && hasCategories && (
            <div className="text-xs uppercase tracking-wide mb-1 absolute top-2 right-2 px-2 py-1 rounded-full shadow-md bg-white text-black">
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled category'
                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }
                return null
              })}
            </div>
          )}
        </div>

        {(showCategories || titleToUse) && (
          <CardHeader>
            {titleToUse && (
              <CardTitle className="text-xl">
                <Link href={href} ref={link.ref} className="">
                  {titleToUse}
                </Link>
              </CardTitle>
            )}
          </CardHeader>
        )}

        {description && (
          <CardContent className="pt-0">
            <CardDescription>{sanitizedDescription}</CardDescription>
          </CardContent>
        )}
      </CardComponent>
    </article>
  )
}
