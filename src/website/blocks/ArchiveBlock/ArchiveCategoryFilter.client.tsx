'use client'

import React, { useMemo, useRef, useState } from 'react'
import type { Category, Post } from '@/payload-types'
import { CollectionArchive } from '@/website/components/CollectionArchive'
import { Button } from '@/website/components/elements/button'

export const ArchiveCategoryFilter: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [activeCategoryIds, setActiveCategoryIds] = useState<Set<string>>(() => new Set())
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
    if (activeCategoryIds.size === 0) return posts
    return posts.filter((post) => {
      return post.categories?.some((category) => {
        if (typeof category === 'object' && category) {
          return activeCategoryIds.has(String((category as Category).id))
        }
        return activeCategoryIds.has(String(category))
      })
    })
  }, [posts, activeCategoryIds])

  const applyFilter = (nextCategoryId: string) => {
    if (fadeTimeoutRef.current) {
      window.clearTimeout(fadeTimeoutRef.current)
    }
    setIsVisible(false)
    fadeTimeoutRef.current = window.setTimeout(() => {
      setActiveCategoryIds((current) => {
        const next = new Set(current)
        if (next.has(nextCategoryId)) {
          next.delete(nextCategoryId)
        } else {
          next.add(nextCategoryId)
        }
        return next
      })
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
                  activeCategoryIds.has(category.id)
                    ? 'bg-neutral dark:bg-surface text-primary hover:text-primary hover:bg-neutral/90 dark:hover:bg-surface/90 '
                    : 'bg-transparent text-primary hover:text-primary hover:bg-neutral/70 dark:hover:bg-surface/60'
                }`}
                onClick={() => applyFilter(category.id)}
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
