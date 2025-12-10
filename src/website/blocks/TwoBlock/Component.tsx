import React from 'react'

import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { Media } from '@/website/components/Media'
import type { Media as MediaType } from '@/payload-types'

import { renderChildField, TwoBlockField } from './fields'

export const TwoBlock: React.FC<{
  left?: TwoBlockField[]
  right?: TwoBlockField[]
  backgroundColor?: string
  enableBackground?: boolean
  backgroundMedia?: MediaType | number | null
  backgroundVariant?: 'default' | 'accent' | 'secondary' | 'dark' | 'neutral'
  themeMode?: 'light' | 'dark'
}> = ({
  left = [],
  right = [],
  backgroundColor,
  enableBackground = false,
  backgroundMedia,
  backgroundVariant = 'default',
  themeMode = 'light',
}) => {
  const hasBg = Boolean(backgroundColor)
  const hasBackgroundEnabled = enableBackground && (backgroundMedia || backgroundVariant)
  const rightHasMedia = right.some((field) => field.blockType === 'mediaBlock')
  const theme = themeMode === 'light' ? 'light' : 'dark'

  // Background variant classes
  const backgroundVariantClasses: Record<string, string> = {
    default: 'bg-background',
    accent: 'bg-accent',
    secondary: 'bg-secondary',
    dark: 'bg-card',
    neutral: 'bg-neutral',
  }

  const gridClasses = cn(
    'grid grid-cols-1 md:grid-cols-2 items-center gap-y-6',
    backgroundColor,
    hasBg ? 'two-background-spacing' : 'gap-x-8',
  )

  return (
    <div className="container">
      <div
        className={cn('relative overflow-hidden', hasBackgroundEnabled && 'py-16 rounded-2xl')}
        data-theme={hasBackgroundEnabled ? theme : undefined}
      >
        <TrackImpression componentName="Two Column Block" componentType="two-block">
          {/* Background Layer */}
          {hasBackgroundEnabled && (
            <div className="absolute inset-0 -z-10">
              {backgroundMedia && typeof backgroundMedia === 'object' ? (
                backgroundMedia.mimeType?.includes('video') ? (
                  <Media
                    className="absolute inset-0 w-full h-full object-cover"
                    resource={backgroundMedia}
                  />
                ) : (
                  <Media fill imgClassName="object-cover" resource={backgroundMedia} />
                )
              ) : (
                <div className={cn('w-full h-full', backgroundVariantClasses[backgroundVariant])} />
              )}
            </div>
          )}

          {/* Content Layer */}
          <div className={cn('relative z-10', hasBackgroundEnabled && 'container')}>
            <div className={gridClasses}>
              {[left, right].map((column, colIdx) => {
                const colClass = cn(
                  'two-column-layout flex flex-col',
                  colIdx === 0 ? 'two-column-left' : 'two-column-right',
                  !hasBg && 'gap-6',
                  colIdx === 1 && rightHasMedia && 'order-first md:order-none',
                )

                return (
                  <div key={colIdx} className={colClass}>
                    {column.map((field, i) => {
                      const key = `${colIdx}-${i}`
                      const isMediaBlock = field.blockType === 'mediaBlock'
                      const isInDarkTheme = Boolean(hasBackgroundEnabled && theme === 'dark')
                      const child = renderChildField(field, key, true, isInDarkTheme)

                      const wrapperClasses = cn(
                        hasBg && !isMediaBlock && 'p-6',
                        colIdx === 1 && isMediaBlock && 'order-first md:order-none',
                      )

                      return (
                        <div key={key} className={wrapperClasses}>
                          {child}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </TrackImpression>
      </div>
    </div>
  )
}
