'use client'
import { useHeaderThemeOverride } from '@/providers/Theme/LocalTheme/LocalTheme'
import React from 'react'

const PageClient: React.FC = () => {
  /* Force the header to be dark mode while we have an image behind it */
  useHeaderThemeOverride('dark')
  return <React.Fragment />
}

export default PageClient
