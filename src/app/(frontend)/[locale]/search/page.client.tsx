'use client'
import React, { useEffect } from 'react'
import { track } from '@/cms/utilities/analytics-server'
import { useSearchParams } from 'next/navigation'

const PageClient: React.FC = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  useEffect(() => {
    // Track search with query term
    if (query) {
      track('search', {
        search_term: query,
      })
    }
  }, [query])

  return <React.Fragment />
}

export default PageClient
