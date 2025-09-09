'use client'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/cms/components/Link'
import { Media } from '@/cms/components/Media'
import RichText from '@/cms/components/RichText'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React from 'react'

import { useEffect, useRef } from 'react'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText, theme }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme(theme === 'dark' ? 'dark' : 'light')
  })

  return (
    <div
      ref={heroRef}
      className="relative flex items-center justify-center text-primary mb-8 -mt-[10.4rem]"
      data-theme={theme}
    >
      <div className="container mb-8 z-10 relative flex items-center w-full">
        <div className="max-w-[36.5rem] hero-rich-text ">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media &&
          typeof media === 'object' &&
          (media.mimeType && media.mimeType.includes('video') ? (
            <video
              className="absolute inset-0 w-full h-full object-cover "
              autoPlay
              muted
              loop
              playsInline
              src={`/media/${media.filename}`}
            />
          ) : (
            <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
          ))}
      </div>
    </div>
  )
}
