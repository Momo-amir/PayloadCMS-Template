import React from 'react'
import { cn } from '@/cms/utilities/ui'
import RichText from '@/cms/components/RichText'
import { CMSLink } from '@/cms/components/Link'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

export const ContentBlock: React.FC<ContentBlockProps & { enableGutter?: boolean }> = ({
  useColumns = false,
  richText,
  columns,
  enableGutter = false,
}) => {
  // never allow null
  const safeColumns = columns ?? []

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className={cn({ 'my-16': enableGutter, container: enableGutter })}>
      {/* Mode 1: single rich text */}
      {!useColumns && richText && (
        <div className="prose w-full">
          <RichText data={richText} enableGutter={false} />
        </div>
      )}

      {/* Mode 2: columns */}
      {useColumns && safeColumns.length > 0 && (
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
          {safeColumns.map((col, index) => {
            const { enableLink, link, richText, size } = col
            return (
              <div
                key={index}
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
              >
                {richText && <RichText data={richText} enableGutter={false} />}
                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
