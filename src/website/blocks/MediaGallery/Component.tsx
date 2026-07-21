import React from 'react'
import type { CSSProperties } from 'react'
import type { MediaGalleryBlock as MediaGalleryBlockType } from '@/payload-types'
import { Media } from '@/website/components/Media'
import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import RichText from '@/website/components/RichText'
import { RichTextBlock as RichTextBlockComponent } from '@/website/blocks/RichText/Component'
import { ScrollRevealGrid } from './Component.client'

const GALLERY_STAGGER_MAX_INDEX = 8

const galleryTileStyle = (index: number): CSSProperties =>
  ({ '--gallery-stagger-index': index % GALLERY_STAGGER_MAX_INDEX }) as CSSProperties

type GalleryItem = NonNullable<MediaGalleryBlockType['images']>[number]
type Props = MediaGalleryBlockType

export const MediaGalleryBlock: React.FC<Props> = ({ introContent, layout, images }) => {
  const safeImages: GalleryItem[] = images ?? []
  const isBento = layout === 'bento'

  return (
    <div className="my-16">
      {safeImages.length ? (
        <TrackImpression
          componentName={`Media Gallery Block (${safeImages.length} images)`}
          componentType="gallery"
          as="section"
        >
          {introContent && (
            <div className="container mb-16">
              <RichText className="ms-0" data={introContent} enableGutter={false} />
            </div>
          )}
          <div className="container">
            <ScrollRevealGrid
              className={cn(
                isBento ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'columns-2 md:columns-3 gap-4',
              )}
            >
              {safeImages.map((image, i) => {
                const isFeatured = isBento && image.featured
                const isText = image.type === 'text'
                return (
                  <div
                    key={image.id ?? i}
                    style={galleryTileStyle(i)}
                    className={cn(
                      'gallery-stagger-item group relative overflow-hidden rounded-lg',
                      isBento
                        ? cn('aspect-square', isFeatured && 'col-span-2 row-span-2')
                        : 'mb-4 break-inside-avoid',
                      isText && 'flex items-center bg-surface p-6',
                    )}
                  >
                    {isText ? (
                      <RichTextBlockComponent
                        richText={image.richText ?? undefined}
                        links={image.links ?? undefined}
                        enableGutter={false}
                      />
                    ) : (
                      <>
                        <Media
                          resource={image.media}
                          fill={isBento}
                          imgClassName={isBento ? 'object-cover' : 'w-full h-auto'}
                          sizes="medium"
                          priority={i === 0}
                        />
                        {image.caption && (
                          <div className="absolute inset-0 flex items-end bg-black/0 p-4 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                            <span className="text-sm text-white">{image.caption}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </ScrollRevealGrid>
          </div>
        </TrackImpression>
      ) : null}
    </div>
  )
}
