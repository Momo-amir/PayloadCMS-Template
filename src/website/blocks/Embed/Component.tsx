import React from 'react'
import type { EmbedBlock as EmbedBlockType } from '@/payload-types'
import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { EmbedFrame } from './Component.client'

type Props = EmbedBlockType

export const EmbedBlock: React.FC<Props> = ({ label, html, maxWidth }) => {
  const isFullWidth = maxWidth === 'full'

  return (
    <div className="my-16">
      {html ? (
        <TrackImpression componentName="Embed Block" componentType="embed" as="section">
          <div className={cn(!isFullWidth && 'container')}>
            {label && <p className="mb-4 text-sm font-medium text-primary/70">{label}</p>}
            <EmbedFrame html={html} />
          </div>
        </TrackImpression>
      ) : null}
    </div>
  )
}
