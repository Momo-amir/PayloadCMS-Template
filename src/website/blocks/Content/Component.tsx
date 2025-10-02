import React from 'react'
import { cn } from '@/cms/utilities/ui'
import RichText from '@/cms/components/RichText'
import { CMSLink } from '@/cms/components/Link'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'
export const ContentBlock: React.FC<ContentBlockProps & { enableGutter?: boolean }> = (props) => {
  const enableGutter = props.enableGutter ?? true
  const { section } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className={cn({ 'my-16': enableGutter, container: enableGutter })}>
      <div className={cn('grid grid-cols-4 lg:grid-cols-12 gap-y-8', { 'gap-x-12': enableGutter })}>
        {section &&
          section.length > 0 &&
          section.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} className="min-w-full md:min-w-0" />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
