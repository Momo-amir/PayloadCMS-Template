'use client'
import React, { useEffect } from 'react'
import { trackPageView } from '@/cms/utilities/analytics-server'
import type { Page } from '@/payload-types'

const PageClient: React.FC<{ page: Page }> = ({ page }) => {
  const pageKey = page?.id || page?.slug || page?.title

  useEffect(() => {
    // Track page view with slug as title
    const pageTitle = page.title || page.slug || 'Unknown Page'
    trackPageView(pageTitle, document.referrer)
  }, [pageKey, page.slug, page.title])

  return <React.Fragment />
}

export default PageClient
