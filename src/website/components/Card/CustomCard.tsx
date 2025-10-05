'use client'
import { cn } from '@/cms/utilities/ui'
import useClickableCard from '@/cms/utilities/useClickableCard'
import {
  Card as CardComponent,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/website/components/elements/card'
import type { CardBlock as CardBlockType, Media } from '@/payload-types'
import React from 'react'
import { IconArrowRight } from '@tabler/icons-react'
import { ImageMedia } from '../Media/ImageMedia'
import { CMSLink, type CMSLinkReference } from '@/website/components/Link'
// Variants are defined locally in this file for simplicity

type CardItem = CardBlockType['cards'][number]

type CardVariant = 'default' | 'light' | 'dark' | 'primary' | 'secondary'

type CardProps = {
  className?: string
  card: CardItem
  variant?: CardVariant
}

function getMediaInfo(media?: Media | number | null) {
  if (!media || typeof media === 'number')
    return { url: undefined as string | undefined, alt: undefined as string | undefined }
  return { url: media.url ?? undefined, alt: media.alt ?? undefined }
}

export const Card: React.FC<CardProps> = ({ card, className, variant = 'default' }) => {
  const title = card.title
  const description = card.description
  // Optional tag label
  const tag = typeof card.tag === 'string' ? card.tag : undefined
  const ctaLabel = card.link?.label ?? null
  // Use CMSLink for URL building; clickable-card hook will discover the anchor
  const l = card.link
  const newTab = Boolean(l?.newTab)
  const { card: cardRef } = useClickableCard<HTMLDivElement>({ newTab })

  const mediaInfo = getMediaInfo(card.media as Media | number | null)

  // Single source of truth for card variant classes
  const cardVariant: Record<CardVariant, { wrapper: string; chip: string }> = {
    default: { wrapper: 'bg-card', chip: 'bg-white text-black' },
    light: { wrapper: 'bg-base', chip: 'bg-primary text-base' },
    dark: { wrapper: 'bg-accent text-white', chip: 'bg-accenttwo text-white' },
    primary: { wrapper: 'bg-black border-primary text-white', chip: 'bg-white text-black' },
    secondary: { wrapper: 'bg-secondary text-white border-secondary', chip: 'bg-white text-black' },
  }

  // Use exported CMSLinkReference type from the CMSLink component
  const cmsLinkReference: CMSLinkReference | null =
    l?.type === 'reference' && l.reference && typeof l.reference === 'object'
      ? {
          relationTo: l.reference.relationTo,
          value: l.reference.value,
        }
      : null

  return (
    <article ref={cardRef.ref} className={cn('group h-full hover:cursor-pointer', className)}>
      <CardComponent
        className={cn(
          'h-full flex flex-col transition hover:shadow-md',
          cardVariant[variant].wrapper,
        )}
      >
        {mediaInfo.url && (
          <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
            <ImageMedia
              resource={card.media as Media}
              alt={mediaInfo.alt || title || ''}
              fill
              imgClassName="object-cover"
            />
            {tag && (
              <span
                className={cn(
                  'text-xs uppercase tracking-wide mb-1 absolute top-2 right-2 px-2 py-1 rounded-md shadow-md ',
                  cardVariant[variant].chip,
                )}
              >
                {tag}
              </span>
            )}
          </div>
        )}
        {(title || description) && (
          <CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
        )}
        {(description || l) && (
          <>
            <CardContent className={cn(!description ? 'pt-0' : undefined)}>
              {description && <CardDescription>{description}</CardDescription>}
            </CardContent>
            <CardFooter>
              {l ? (
                <CMSLink
                  appearance="inline"
                  className={cn('font-bold pointer-events-none flex items-center')}
                  label={ctaLabel || ''}
                  newTab={newTab}
                  reference={cmsLinkReference}
                  type={l?.type || null}
                  url={l?.url || null}
                >
                  <IconArrowRight
                    size={24}
                    className="mx-auto group-hover:translate-x-1 transition-transform ease-in-out "
                  />
                </CMSLink>
              ) : null}
            </CardFooter>
          </>
        )}
      </CardComponent>
    </article>
  )
}

export default Card
