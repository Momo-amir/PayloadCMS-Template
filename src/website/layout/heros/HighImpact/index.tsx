'use client'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/cms/components/Link'
import { Media } from '@/cms/components/Media'
import RichText from '@/cms/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="relative flex items-center justify-center text-primary">
      <div className="container mb-8 z-10 relative flex items-center ">
        <div className="max-w-[36.5rem]  hero-rich-text ">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    s
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 lg:left-1/4  lg:top-10 overflow-hidden select-none min-h-[80vh]">
        {media &&
          typeof media === 'object' &&
          (media.mimeType && media.mimeType.includes('video') ? (
            <video
              className="w-[200vw]"
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
