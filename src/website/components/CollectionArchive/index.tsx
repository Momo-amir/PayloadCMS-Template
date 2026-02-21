import { cn } from '@/cms/utilities/ui'
import React from 'react'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { STAGGER_GRID_CLASS, getStaggerItemProps } from '@/website/utilities/stagger'

import { PostCard, CardPostData } from '@/website/components/Card/PostCard'

const columnClass = (cardCount: number) => {
  switch (cardCount) {
    case 1:
      return 'md:grid-cols-1'
    case 2:
      return 'md:grid-cols-2'
    case 3:
    default:
      return 'md:grid-cols-2 lg:grid-cols-3' // 3+ cards always use 3 columns
  }
}

export type Props = {
  posts: CardPostData[]
  listContext?: string
  animateOnLoad?: boolean
  animationKey?: string | number
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, listContext = 'archive', animateOnLoad = false, animationKey } = props

  return (
    <TrackImpression
      componentName={`Collection Archive (${posts.length} posts)`}
      componentType="collection-archive"
      className={cn('container')}
    >
      <div>
        <div
          key={animationKey}
          className={cn(
            `grid grid-cols-1 ${columnClass(posts.length)} gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8`,
            animateOnLoad && STAGGER_GRID_CLASS,
          )}
        >
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              const cardKey = result.slug || `post-${index}`

              return (
                <div key={cardKey} {...getStaggerItemProps(index, animateOnLoad)}>
                  <PostCard
                    className="h-full"
                    doc={result}
                    relationTo="posts"
                    showCategories
                    position={index + 1}
                    listContext={listContext}
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </TrackImpression>
  )
}
