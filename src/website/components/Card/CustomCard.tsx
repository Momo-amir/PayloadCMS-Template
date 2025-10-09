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
import { CMSLink } from '@/website/components/Link'

type CardItem = CardBlockType['cards'][number]

type CardVariant = 'default' | 'light' | 'dark' | 'primary' | 'secondary'

type CardProps = {
  className?: string
  card: CardItem
  variant?: CardVariant
}

export const Card: React.FC<CardProps> = ({ card, className, variant = 'default' }) => {
  const { title, description, tag, link, media } = card
  const { card: cardRef } = useClickableCard<HTMLDivElement>({ newTab: link?.newTab ?? false })

  //Card variants - Different looks for this type of card
  const cardVariant: Record<CardVariant, { wrapper: string; chip: string }> = {
    default: { wrapper: 'bg-card', chip: 'bg-white text-black' },
    light: { wrapper: 'bg-base', chip: 'bg-primary text-base' },
    dark: { wrapper: 'bg-accent text-white', chip: 'bg-accenttwo text-white' },
    primary: { wrapper: 'bg-black border-primary text-white', chip: 'bg-white text-black' },
    secondary: { wrapper: 'bg-secondary text-white border-secondary', chip: 'bg-white text-black' },
  }

  return (
    <article ref={cardRef.ref} className={cn('group h-full hover:cursor-pointer', className)}>
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
              {link ? (
                <CMSLink
                  {...link}
                  appearance="inline"
                  className={cn('font-bold pointer-events-none flex items-center')}
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
