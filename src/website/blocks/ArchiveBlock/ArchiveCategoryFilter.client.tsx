'use client'

import React, { useState, useTransition } from 'react'
import type { Post } from '@/payload-types'
import { CollectionArchive } from '@/website/components/CollectionArchive'
import { Button } from '@/website/components/elements/button'
import { useRouter, useSearchParams } from 'next/navigation'

type FilterCategory = { id: string; title: string; slug: string }

export const ArchiveCategoryFilter: React.FC<{
  posts: Post[]
  categories: FilterCategory[]
  activeCatSlugs: string[]
  catParamKey: string
  pageParamKey: string
  animationKey?: string | number
}> = ({ posts, categories, activeCatSlugs, catParamKey, pageParamKey, animationKey }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(true)
  const [, startTransition] = useTransition()

  const toggleCategory = (slug: string) => {
    const next = new Set(activeCatSlugs)
    if (next.has(slug)) {
      next.delete(slug)
    } else {
      next.add(slug)
    }

    const params = new URLSearchParams(searchParams.toString())

    if (next.size > 0) {
      params.set(catParamKey, Array.from(next).join(','))
    } else {
      params.delete(catParamKey)
    }

    // Reset to page 1 when filter changes
    params.delete(pageParamKey)

    const qs = params.toString()
    const url = qs ? `?${qs}` : window.location.pathname

    setIsVisible(false)
    startTransition(() => {
      router.push(url, { scroll: false })
    })
    // Fade back in after navigation settles
    setTimeout(() => setIsVisible(true), 150)
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
                variant={activeCatSlugs.includes(category.slug) ? 'pillActive' : 'pill'}
                size="clear"
                onClick={() => toggleCategory(category.slug)}
              >
                {category.title}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <CollectionArchive posts={posts} animateOnLoad animationKey={animationKey} />
      </div>
    </div>
  )
}
