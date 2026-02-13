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
  backgroundMode?: 'color' | 'media'
  backgroundMedia?: MediaType | number | null
  backgroundVariant?: 'default' | 'accent' | 'secondary' | 'dark' | 'neutral'
  textColorMode?: 'white' | 'black'
}> = ({
  left = [],
  right = [],
  backgroundColor,
  enableBackground = false,
  backgroundMode = 'color',
  backgroundMedia,
  backgroundVariant = 'default',
  textColorMode = 'white',
}) => {
  const hasBg = Boolean(backgroundColor)
  const hasBackgroundEnabled = enableBackground
  const rightHasMedia = right.some((field) => field.blockType === 'mediaBlock')
  const textWhite = 'text-white'
  const textBlack = 'text-black'
  const textClassByColor = {
    white: textWhite,
    black: textBlack,
  } as const
  const colorVariantStyles: Record<
    NonNullable<React.ComponentProps<typeof TwoBlock>['backgroundVariant']>,
    { bg: string; text: string }
  > = {
    default: { bg: 'bg-background', text: textBlack },
    accent: { bg: 'bg-accent', text: textWhite },
    secondary: { bg: 'bg-secondary', text: textWhite },
    dark: { bg: 'bg-black', text: textWhite },
    neutral: { bg: 'bg-neutral', text: textBlack },
  }
  const colorVariantStyle = colorVariantStyles[backgroundVariant]
  const showMedia =
    backgroundMode === 'media' && backgroundMedia && typeof backgroundMedia === 'object'
  const forcedTextClass = hasBackgroundEnabled
    ? showMedia
      ? textClassByColor[textColorMode]
      : colorVariantStyle.text
    : undefined

  const gridClasses = cn(
    'grid grid-cols-1 md:grid-cols-2 items-center gap-y-6',
    backgroundColor,
    hasBg ? 'two-background-spacing' : 'gap-x-8',
  )

  return (
    <div className="container">
      <div className={cn('relative overflow-hidden', hasBackgroundEnabled && 'py-16 rounded-2xl')}>
        <TrackImpression componentName="Two Column Block" componentType="two-block">
          {/* Background Layer */}
          {hasBackgroundEnabled && (
            <div className="absolute inset-0 -z-10">
              {showMedia ? (
                backgroundMedia.mimeType?.includes('video') ? (
                  <Media
                    className="absolute inset-0 w-full h-full object-cover"
                    resource={backgroundMedia}
                  />
                ) : (
                  <Media
                    fill
                    imgClassName="object-cover"
                    resource={backgroundMedia}
                    sizes="large"
                  />
                )
              ) : (
                <div className={cn('w-full h-full', colorVariantStyle.bg)} />
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
                      const child = renderChildField(field, key, true, forcedTextClass)

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
