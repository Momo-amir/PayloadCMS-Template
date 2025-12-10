import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/website/components/RichText'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <TrackImpression
      componentName="Low Impact Hero"
      componentType="hero"
      className="container mt-16"
    >
      <div className="max-w-3xl">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </TrackImpression>
  )
}
