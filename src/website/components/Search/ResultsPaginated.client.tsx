'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/website/components/elements/button'
import { PostCard } from '@/website/components/Card/PostCard'
import { PersonCard } from '@/website/components/Card/PersonCard'
import type { Person } from '@/payload-types'
import type { CardPostData } from '@/website/components/Card/PostCard'

type SearchResultsPaginatedProps = {
  collection: 'posts' | 'people'
  posts: CardPostData[]
  people: Person[]
  perPage: number
  queryKey?: string
}

export const SearchResultsPaginated: React.FC<SearchResultsPaginatedProps> = ({
  collection,
  posts,
  people,
  perPage,
  queryKey,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [queryKey])

  const sourceItems = collection === 'posts' ? posts : people
  const totalPages = Math.max(1, Math.ceil(sourceItems.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * perPage
    return sourceItems.slice(start, start + perPage)
  }, [sourceItems, safePage, perPage])

  return (
    <>
      <div className="container">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((item, index) => {
            if (collection === 'posts') {
              const post = item as CardPostData
              return (
                <PostCard
                  key={`post-${post.slug}-${index}`}
                  className="h-full"
                  doc={post}
                  relationTo="posts"
                  showCategories
                  position={(safePage - 1) * perPage + index + 1}
                  listContext="search"
                />
              )
            }

            const person = item as Person
            return <PersonCard key={`person-${person.id}-${index}`} doc={person} />
          })}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="container mt-10 flex items-center justify-center gap-3">
          <Button
            variant="default"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {safePage} / {totalPages}
          </span>
          <Button
            variant="default"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </>
  )
}
