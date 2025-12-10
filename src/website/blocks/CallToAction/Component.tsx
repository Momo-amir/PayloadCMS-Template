import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/website/components/RichText'
import { CMSLink } from '@/website/components/Link'
import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

export const CallToActionBlock: React.FC<CTABlockProps & { enableGutter?: boolean }> = ({
  links,
  richText,
  enableGutter = true,
}) => {
  return (
    <div className={cn({ 'my-16': enableGutter, container: enableGutter })}>
      <TrackImpression componentName="CTA Block" componentType="cta">
        <div className=" rounded  border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
          <div className="max-w-3xl flex items-center">
            {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
          </div>
          <div className="flex flex-col gap-8">
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
