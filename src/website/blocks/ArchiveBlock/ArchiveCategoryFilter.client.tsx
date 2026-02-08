'use client'

import React, { useMemo, useRef, useState } from 'react'
import type { Category, Post } from '@/payload-types'
import { CollectionArchive } from '@/website/components/CollectionArchive'
import { Button } from '@/website/components/elements/button'

export const ArchiveCategoryFilter: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const fadeTimeoutRef = useRef<number | null>(null)

  const categories = useMemo(() => {
    const map = new Map<string, string>()

    posts.forEach((post) => {
      post.categories?.forEach((category) => {
        if (typeof category === 'object' && category) {
          const cat = category as Category
          if (cat?.id) {
            map.set(String(cat.id), cat.title || 'Untitled')
          }
        }
      })
    })

    return Array.from(map.entries()).map(([id, title]) => ({ id, title }))
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!activeCategoryId) return posts

    return posts.filter((post) => {
      return post.categories?.some((category) => {
        if (typeof category === 'object' && category) {
          return String((category as Category).id) === activeCategoryId
        }
        return String(category) === activeCategoryId
      })
    })
  }, [posts, activeCategoryId])

  const applyFilter = (nextCategoryId: string | null) => {
    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current)
    }
    setIsVisible(false)
    fadeTimeoutRef.current = window.setTimeout(() => {
      setActiveCategoryId(nextCategoryId)
      setIsVisible(true)
    }, 150)
  }

  return (
    <div>
      {categories.length > 0 && (
        <div className="container mb-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                type="button"
                variant="ghost"
                size="sm"
                className={`group relative rounded-full px-3 py-1 text-sm transition-all duration-200 ${
                  activeCategoryId === category.id
                    ? 'bg-neutral dark:bg-surface text-primary hover:text-primary hover:bg-neutral/90 dark:hover:bg-surface/90 '
                    : 'bg-transparent text-primary hover:text-primary hover:bg-neutral/70 dark:hover:bg-surface/60'
                }`}
                onClick={() => applyFilter(activeCategoryId === category.id ? null : category.id)}
              >
                <span className="relative inline-flex items-center">{category.title}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <CollectionArchive posts={filteredPosts} />
      </div>
    </div>
  )
}
