'use client'

import { cn } from '@/cms/utilities/ui'
import React, { useRef, useState } from 'react'

import type { Props as MediaProps } from '../types'

import { getClientSideURL } from '@/cms/utilities/getURL'
import { Button } from '../../elements/button'
import { IconPlayerPlayFilled, IconPlayerPauseFilled } from '@tabler/icons-react'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const {
    onClick,
    resource,
    videoClassName,
    autoplay = true,
    loop = true,
    muted = true,
    controls = false,
  } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  // const [showFallback] = useState<boolean>()

  const handleTogglePlay = () => {
    const { current: video } = videoRef
    if (video) {
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        video.play()
        setIsPlaying(true)
      }
    }
    // Call the onClick prop if provided
    if (onClick) {
      onClick()
    }
  }

  if (resource && typeof resource === 'object') {
    const { filename } = resource

    return (
      <div className="relative group">
        <video
          autoPlay={autoplay}
          className={cn(videoClassName)}
          controls={controls}
          loop={loop}
          muted={muted}
          playsInline
          ref={videoRef}
        >
          <source src={`${getClientSideURL()}/media/${filename}`} />
        </video>
        {!autoplay && (
          <Button
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accenttwo rounded-full transition duration-300 border-none cursor-pointer hover:bg-accentthree',
              isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100',
            )}
            onClick={handleTogglePlay}
            icon={isPlaying ? IconPlayerPauseFilled : IconPlayerPlayFilled}
            iconSize={45}
          />
        )}
      </div>
    )
  }

  return null
}
