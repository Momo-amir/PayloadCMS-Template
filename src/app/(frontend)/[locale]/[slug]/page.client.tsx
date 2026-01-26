'use client'
import React, { useEffect } from 'react'
import { trackPageView } from '@/cms/utilities/analytics-server'
import type { Page } from '@/payload-types'

const PageClient: React.FC<{ page: Page }> = ({ page }) => {
  useEffect(() => {
    // Track page view with slug as title
    const pageTitle = page.title || page.slug || 'Unknown Page'
    trackPageView(pageTitle, document.referrer)
  }, [page])

  return <React.Fragment />
}

export default PageClient
