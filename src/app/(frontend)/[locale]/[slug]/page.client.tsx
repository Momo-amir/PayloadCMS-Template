'use client'
import React, { useEffect } from 'react'
import { trackPageView } from '@/cms/utilities/analytics-server'

const PageClient: React.FC = () => {
  useEffect(() => {
    // Track page view with title and referrer
    trackPageView(document.title, document.referrer)
  }, [])

  return <React.Fragment />
}

export default PageClient
