import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/website/components/RichText'
import { CMSLink } from '@/website/components/Link'
import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

export const CallToActionBlock: React.FC<
  CTABlockProps & { enableGutter?: boolean; textClassName?: string }
> = ({ links, richText, enableGutter = true, textClassName, centered }) => {
  const isCentered = Boolean(centered)
  const contentWrapperClass = cn(
    'rounded shadow-md bg-surface p-4 flex gap-8',
    isCentered ? 'flex-col items-center text-center' : 'md:flex-row md:justify-between md:items-center',
  )
  const linksWrapperClass = cn(
    'flex gap-8',
    isCentered ? 'items-center justify-center flex-row flex-wrap' : 'flex-col',
  )
  return (
    <div className={cn({ 'my-16': enableGutter, container: enableGutter })}>
      <TrackImpression componentName="CTA Block" componentType="cta">
        <div className={contentWrapperClass}>
          <div className={cn('max-w-3xl flex items-center', isCentered && 'justify-center')}>
            {richText && (
              <RichText
                className={cn('mb-0', textClassName)}
                data={richText}
                enableGutter={false}
              />
            )}
          </div>
          <div className={linksWrapperClass}>
            {(links || []).map(({ link }, i) => {
              return (
                <CMSLink
                  key={i}
                  size="lg"
                  {...link}
                  trackingSection="CTA Block"
                  trackingName={link?.label || `CTA Link ${i + 1}`}
                />
              )
            })}
          </div>
        </div>
      </TrackImpression>
    </div>
  )
}
