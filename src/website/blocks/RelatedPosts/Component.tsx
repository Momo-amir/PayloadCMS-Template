import clsx from 'clsx'
import React from 'react'
import RichText from '@/website/components/RichText'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

import type { Post } from '@/payload-types'

import { PostCard } from '@/website/components/Card/PostCard'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: SerializedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <TrackImpression
      componentName={`Related Posts (${docs?.length || 0} posts)`}
      componentType="related-posts"
      className={clsx('lg:container', className)}
    >
      {introContent && <RichText data={introContent} enableGutter={false} />}

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
