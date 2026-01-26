'use client'

import { useEffect } from 'react'
import { useScrollDepthTracking } from '@/cms/utilities/analytics-server'

/**
 * Scroll depth tracking using IntersectionObserver
 * Tracks when users scroll to 25%, 50%, 75%, 100% of page
 */
export function ScrollDepthTracker() {
  useEffect(() => {
    const cleanup = useScrollDepthTracking()
    return cleanup
  }, [])

  return null
}

// Keep download hook available for future use (not connected yet)
export { useScrollDepthTracking } from '@/cms/utilities/analytics-server'
