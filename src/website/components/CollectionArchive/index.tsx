import { cn } from '@/cms/utilities/ui'
import React from 'react'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

import { PostCard, CardPostData } from '@/website/components/Card/PostCard'

export type Props = {
  posts: CardPostData[]
  listContext?: string
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, listContext = 'archive' } = props

  return (
    <TrackImpression
      componentName={`Collection Archive (${posts.length} posts)`}
      componentType="collection-archive"
      className={cn('container')}
    >
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
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
