'use client'
import { cn } from '@/cms/utilities/ui'
import useClickableCard from '@/cms/utilities/useClickableCard'
import Link from 'next/link'
import { buttonVariants } from '@/website/components/ui/button'
import {
  Card as CardComponent,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardVariant,
} from '@/website/components/ui/card'
import type { CardBlock as CardBlockType, Media } from '@/payload-types'
import Image from 'next/image'
import React from 'react'
import { IconArrowRight } from '@tabler/icons-react'

type CardItem = CardBlockType['cards'][number]

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
  const tag = (card as any)?.tag as string | undefined
  const ctaLabel = card.link?.label ?? null
  let href: string | undefined

  if (
    card.link?.type === 'reference' &&
    card.link.reference &&
    typeof card.link.reference === 'object'
  ) {
    const ref = card.link.reference
    if (ref.value && typeof ref.value === 'object' && 'slug' in ref.value && ref.value.slug) {
      const prefix = ref.relationTo !== 'pages' ? `/${ref.relationTo}` : ''
      href = `${prefix}/${ref.value.slug}`
    }
  } else if (card.link?.type === 'custom') {
    href = card.link.url || undefined
  }

  const isExternal = Boolean(
    href && (/^https?:\/\//.test(href) || /^\w+:/.test(href) || href.startsWith('//')),
  )
  const newTab = Boolean(card.link?.newTab)
  const { card: cardRef, link } = useClickableCard<HTMLDivElement>({ external: isExternal, newTab })

  const mediaInfo = getMediaInfo(card.media as Media | number | null)

  return (
    <article ref={cardRef.ref} className={cn('group h-full', className)}>
      <CardComponent
        className={cn('h-full flex flex-col transition hover:shadow-md')}
        variant={variant}
      >
        {mediaInfo.url && (
          <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={mediaInfo.url}
              alt={mediaInfo.alt || title || ''}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader className="flex-1">
          {tag && (
            <span className="text-xs uppercase tracking-wide text-accent2 mb-1 block">{tag}</span>
          )}
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        {(ctaLabel || href) && (
          <CardContent className="pt-0">
            {href ? (
              <Link
                className={cn(buttonVariants({ variant: 'link' }))}
                href={href}
                ref={link.ref}
                {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {ctaLabel || ''}
                <IconArrowRight
                  size={30}
                  className="mx-auto group-hover:translate-x-1 transition-transform ease-in-out"
                />
              </Link>
            ) : (
              <span className={cn(buttonVariants({ variant: 'link' }), 'pointer-events-none')}>
                {ctaLabel || ''}
                <IconArrowRight
                  size={30}
                  className="mx-auto group-hover:translate-x-1 transition-transform ease-in-out"
                />
              </span>
            )}
          </CardContent>
        )}
      </CardComponent>
    </article>
  )
}

export default Card
