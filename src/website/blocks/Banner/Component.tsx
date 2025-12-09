import type { BannerBlock as BannerBlockProps } from '@/payload-types'

import { cn } from '@/cms/utilities/ui'
import React from 'react'
import RichText from '@/website/components/RichText'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <TrackImpression
      componentName="Banner"
      componentType="banner"
      className={cn('mx-auto my-8 w-full', className)}
    >
      <div
        className={cn('border py-3 px-6 flex items-center rounded', {
          'border-border bg-base': style === 'info',
          'border-error bg-error': style === 'error',
          'border-success bg-success': style === 'success',
          'border-warning bg-warning': style === 'warning',
        })}
      >
        <RichText data={content} enableGutter={false} enable={false} />
      </div>
    </TrackImpression>
  )
}
