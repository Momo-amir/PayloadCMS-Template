import React from 'react'
import { IconCheck } from '@tabler/icons-react'
import type { PriceCardsBlock as PriceCardsBlockType } from '@/payload-types'
import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { CMSLink } from '@/website/components/Link'
import RichText from '@/website/components/RichText'
import { STAGGER_GRID_CLASS, getStaggerItemProps } from '@/website/utilities/stagger'

type Tier = NonNullable<PriceCardsBlockType['tiers']>[number]
type Props = PriceCardsBlockType

const columnClass = (tierCount: number) => {
  switch (tierCount) {
    case 1:
      return 'md:grid-cols-1'
    case 2:
      return 'md:grid-cols-2'
    case 3:
      return 'md:grid-cols-2 lg:grid-cols-3'
    default:
      return 'md:grid-cols-2 lg:grid-cols-4'
  }
}

export const PriceCardsBlock: React.FC<Props> = ({ introContent, tiers }) => {
  const safeTiers: Tier[] = tiers ?? []

  return (
    <div className="my-16">
      {safeTiers.length ? (
        <TrackImpression
          componentName={`Price Cards Block (${safeTiers.length} tiers)`}
          componentType="pricing"
          as="section"
        >
          {introContent && (
            <div className="container mb-16">
              <RichText className="ms-0" data={introContent} enableGutter={false} />
            </div>
          )}
          <div className="container">
            <div className={cn('grid gap-8', STAGGER_GRID_CLASS, columnClass(safeTiers.length))}>
              {safeTiers.map((tier, i) => (
                <div key={tier.id ?? i} {...getStaggerItemProps(i)}>
                  <div
                    className={cn(
                      'h-full w-full min-w-0 flex flex-col gap-6 rounded-lg border border-border bg-surface p-8',
                      tier.highlighted && 'border-accent shadow-md ring-1 ring-accent',
                    )}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-primary">{tier.title}</h3>
                      {tier.subheading && (
                        <p className="mt-2 text-2xl font-semibold text-primary">
                          {tier.subheading}
                        </p>
                      )}
                      {tier.description && (
                        <p className="mt-2 text-sm text-primary/70">{tier.description}</p>
                      )}
                    </div>
                    {tier.bullets && tier.bullets.length > 0 && (
                      <ul className="flex flex-1 flex-col gap-3">
                        {tier.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={bullet.id ?? bulletIndex}
                            className="flex items-start gap-2 text-sm text-primary"
                          >
                            <IconCheck size={18} className="mt-0.5 shrink-0 text-accent" />
                            <span>{bullet.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {tier.link && (
                      <CMSLink
                        size="lg"
                        {...tier.link}
                        trackingSection="Price Cards Block"
                        trackingName={tier.link.label || `${tier.title} CTA`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TrackImpression>
      ) : null}
    </div>
  )
}
