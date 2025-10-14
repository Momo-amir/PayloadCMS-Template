'use client'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/website/components/Link'
import { Media } from '@/website/components/Media'
import RichText from '@/website/components/RichText'
import { useHeaderThemeOverride } from '@/providers/Theme/LocalTheme/LocalTheme'
import React from 'react'

import { useRef } from 'react'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText, theme }) => {
  const forced = theme === 'dark' ? 'dark' : 'light'
  useHeaderThemeOverride(forced)
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={heroRef}
      className="relative flex items-center justify-center text-primary mb-8 -mt-[9.4rem]"
      data-theme={theme}
    >
      <div className="container mb-8 z-10 relative flex items-center w-full mt-20 sm:mt-16">
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
            <Media
              className="absolute inset-0 w-full h-full object-cover "
              priority
              resource={media}
            />
          ) : (
            <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
          ))}
      </div>
    </div>
  )
}
