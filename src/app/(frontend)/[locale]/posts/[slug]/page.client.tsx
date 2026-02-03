'use client'
import { useHeaderThemeOverride } from '@/providers/Theme/LocalTheme/LocalTheme'
import React, { useEffect } from 'react'
import { trackPageView, trackPostView } from '@/cms/utilities/analytics-server'
import type { Post } from '@/payload-types'

const PageClient: React.FC<{ post: Post }> = ({ post }) => {
  /* Force the header to be dark mode while we have an image behind it */
  useHeaderThemeOverride('dark')

  const postKey = post?.id || post?.slug || post?.title

  useEffect(() => {
    // Track generic page view with post title
    const postTitle = post.title || post.slug || 'Unknown Post'
    trackPageView(postTitle, document.referrer)

    // Track specific post view
    const categories = post.categories
      ? post.categories
          .map((cat) => {
            if (typeof cat === 'object' && cat !== null && 'title' in cat) {
              return cat.title
            }
            return null
          })
          .filter(Boolean)
      : []
    trackPostView(post.title || '', post.slug || '', categories as string[])
  }, [postKey, post.slug, post.title, post.categories])

  return <React.Fragment />
}

export default PageClient
