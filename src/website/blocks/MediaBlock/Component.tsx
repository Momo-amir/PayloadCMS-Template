import type { StaticImageData } from 'next/image'

import { cn } from '@/cms/utilities/ui'
import React from 'react'
import RichText from '@/website/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '@/website/components/Media'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  videoClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
  // Video-specific props
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    videoClassName,
    media,
    staticImage,
    disableInnerContainer,
    autoplay,
    loop,
    muted,
    controls,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  // Determine media type for tracking
  const mediaType =
    media && typeof media === 'object' && media.mimeType?.startsWith('video/') ? 'video' : 'image'

  return (
    <TrackImpression
      componentName={`Media Block (${mediaType})`}
      componentType="media"
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <Media
          imgClassName={cn(' media-block rounded-[0.8rem]', imgClassName, {
            border: enableGutter && 'border-border',
          })}
          videoClassName={cn(' media-block rounded-[0.8rem]', videoClassName, {
            border: enableGutter && 'border-border',
          })}
          resource={media}
          src={staticImage}
          autoplay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          sizes="xlarge"
        />
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </TrackImpression>
  )
}
