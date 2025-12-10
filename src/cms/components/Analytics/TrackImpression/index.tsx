'use client'

import React from 'react'
import { useTrackImpression } from '@/cms/hooks/useAnalytics'

type TrackImpressionProps = {
  children: React.ReactNode
  componentName: string
  componentType?: string
  threshold?: number
  minVisibleTime?: number
  className?: string
  as?: React.ElementType
}

/**
 * Client-side wrapper component for tracking impressions
 * Allows server components to remain server-side while still tracking analytics
 *
 * @example
 * <TrackImpression componentName="Hero Banner" componentType="hero">
 *   <YourServerComponent />
 * </TrackImpression>
 */
export const TrackImpression: React.FC<TrackImpressionProps> = ({
  children,
  componentName,
  componentType,
  threshold = 0.5,
  minVisibleTime = 1000,
  className,
  as: Component = 'div',
}) => {
  const ref = useTrackImpression(componentName, componentType, threshold, minVisibleTime)

  return (
    <Component ref={ref as React.Ref<HTMLElement>} className={className}>
      {children}
    </Component>
  )
}
