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
import type { CardBlock as CardBlockType } from '@/payload-types'
import React from 'react'
import { IconArrowRight } from '@tabler/icons-react'
import { Media as MediaComponent } from '../Media'
import Link from 'next/link'
import { trackCardClick } from '@/cms/utilities/analytics-server'
import { usePrivacy } from '@/providers/Privacy'

type CardItem = NonNullable<CardBlockType['cards']>[number]

export type CardVariant = 'default' | 'accent' | 'accentThree' | 'dark' | 'secondary' | 'neutral'

type CardProps = {
  className?: string
  card: CardItem
  variant?: CardVariant
}

export const Card: React.FC<CardProps> = ({ card, className, variant = 'default' }) => {
  const { title, description, tag, link, media } = card
  const { card: cardRef, link: linkRef } = useClickableCard<HTMLDivElement>({
    newTab: link?.newTab ?? false,
  })
  const { cookieConsent } = usePrivacy()

  const getHref = (): string => {
    if (!link) return ''
    if (link.type === 'reference' && typeof link.reference?.value === 'object') {
      const slug = link.reference.value.slug
      const relationTo = link.reference.relationTo
      return relationTo !== 'pages' ? `/${relationTo}/${slug}` : `/${slug}`
    }
    return link.url || ''
  }

  const href = getHref()

  const handleClick = () => {
    if (cookieConsent && title && href) {
      trackCardClick(title, 'custom-card', href)
    }
  }

  //Card variants - Different looks for this type of card
  const cardVariant: Record<CardVariant, { wrapper: string; chip: string }> = {
    default: {
      wrapper: 'bg-surface text-primary border-none ',
      chip: 'bg-white text-black',
    },
    accent: { wrapper: 'bg-accent text-white', chip: 'bg-white text-black' },
    accentThree: { wrapper: 'bg-accentthree text-black', chip: 'bg-accenttwo text-white' },
    dark: { wrapper: 'bg-black border-none text-white', chip: 'bg-white text-black' },
    secondary: { wrapper: 'bg-secondary text-white border-none', chip: 'bg-white text-black' },
    neutral: { wrapper: 'bg-neutral text-black border-none', chip: 'bg-white text-black' },
  }

  return (
    <article
      ref={cardRef.ref}
      className={cn('group h-full hover:cursor-pointer', className)}
      onClick={handleClick}
    >
      <CardComponent
        className={cn(
          'h-full flex flex-col transition hover:shadow-md',
          cardVariant[variant].wrapper,
        )}
      >
        {media && (
          <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
            <MediaComponent resource={media} fill imgClassName="object-cover" />
            {tag && (
              <span
                className={cn(
                  'text-xs uppercase tracking-wide mb-1 absolute top-2 right-2 px-2 py-1 rounded-full shadow-md ',
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
        {(description || link) && (
          <>
            <CardContent className={cn(!description ? 'pt-0' : undefined)}>
              {description && <CardDescription>{description}</CardDescription>}
            </CardContent>
            <CardFooter className="mt-auto">
              {link && href ? (
                <Link
                  ref={linkRef.ref}
                  href={href}
                  className={cn('font-bold flex items-center gap-2', cardVariant[variant].wrapper)}
                  {...linkRef.props}
                >
                  {link.label && <span>{link.label}</span>}
                  <IconArrowRight
                    size={24}
                    className="group-hover:translate-x-1 transition-transform ease-in-out"
                  />
                </Link>
              ) : null}
            </CardFooter>
          </>
        )}
      </CardComponent>
    </article>
  )
}

export default Card
