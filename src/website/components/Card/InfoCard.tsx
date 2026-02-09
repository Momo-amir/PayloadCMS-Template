'use client'
import { cn } from '@/cms/utilities/ui'
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
import { Media as MediaComponent } from '../Media'

type CardItem = NonNullable<CardBlockType['infoCards']>[number]

export type InfoCardVariant =
  | 'default'
  | 'accent'
  | 'accentThree'
  | 'dark'
  | 'secondary'
  | 'neutral'

type InfoCardProps = {
  className?: string
  card: CardItem
  variant?: InfoCardVariant
}

export const InfoCard: React.FC<InfoCardProps> = ({ card, className, variant = 'default' }) => {
  const { title, description, tag, media } = card

  const cardVariant: Record<InfoCardVariant, { wrapper: string; chip: string }> = {
    default: {
      wrapper: 'bg-surface text-primary border-none ',
      chip: 'bg-white text-black',
    },
    accent: { wrapper: 'bg-accent text-white', chip: 'bg-white text-black' },
    accentThree: { wrapper: 'bg-accentthree text-black', chip: 'bg-accenttwo text-white' },
    dark: {
      wrapper: 'bg-black dark:border dark:border-surface text-white',
      chip: 'bg-white text-black',
    },
    secondary: { wrapper: 'bg-secondary text-white border-none', chip: 'bg-white text-black' },
    neutral: { wrapper: 'bg-neutral text-black border-none', chip: 'bg-white text-black' },
  }

  return (
    <article className={cn('group h-full w-full min-w-0', className)}>
      <CardComponent
        className={cn('h-full w-full min-w-0 flex flex-col', cardVariant[variant].wrapper)}
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
          <CardHeader>
            {title && <CardTitle className="wrap-break-word">{title}</CardTitle>}
          </CardHeader>
        )}
        {description && (
          <CardContent className={cn('flex-1', !description ? 'pt-0' : undefined)}>
            <CardDescription className="wrap-break-word">{description}</CardDescription>
          </CardContent>
        )}
        <CardFooter className="mt-auto" />
      </CardComponent>
    </article>
  )
}

export default InfoCard
