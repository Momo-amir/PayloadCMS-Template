import React from 'react'
import type { CardBlock as CardBlockType } from '@/payload-types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/website/components/card'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/cms/utilities/ui'

type Props = CardBlockType & { className?: string }

const columnClass = (cardCount: number) => {
  switch (cardCount) {
    case 1:
      return 'md:grid-cols-1'
    case 2:
      return 'md:grid-cols-2'
    case 3:
    default:
      return 'md:grid-cols-3' // 3+ cards always use 3 columns
  }
}

function resolveHref(card: CardBlockType['cards'][0]): string | undefined {
  const l: any = card.link
  if (!l) return undefined
  if (l.type === 'custom') return l.url
  if (l.type === 'reference' && l.reference) {
    // Relationship field returns { relationTo, value }
    const ref = l.reference
    if (ref && typeof ref === 'object') {
      // If populated, value may be the full doc; if not, could be an ID.
      const value = 'value' in ref ? ref.value : ref
      if (value && typeof value === 'object') {
        if ('slug' in value && value.slug) return `/${value.slug}`
      }
    }
  }
  return undefined
}

export const CardBlock: React.FC<Props> = ({ heading, cards = [], cardBackgroundColor }) => {
  if (!cards.length) return null
  return (
    <section className={cn('container')}>
      {heading && <h2 className="text-3xl font-semibold mb-8">{heading}</h2>}
      <div className={cn('grid gap-8', columnClass(cards.length))}>
        {cards.map((card, i) => {
          const href = resolveHref(card)
          const media = card.media
          // Use card's custom color if overrideColor is true, otherwise use default
          const appliedBg =
            card.overrideColor && card.cardBackgroundColor
              ? card.cardBackgroundColor
              : cardBackgroundColor || ''
          const cardInner = (
            <Card className={cn('h-full flex flex-col transition hover:shadow-md', appliedBg)}>
              {media && typeof media === 'object' && 'url' in media && (
                <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={(media as any).url}
                    alt={(media as any).alt || card.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader className="flex-1">
                <CardTitle>{card.title}</CardTitle>
                {card.description && <CardDescription>{card.description}</CardDescription>}
              </CardHeader>
              {card.link && card.link.label && href && (
                <CardContent className="pt-0 text-sm font-medium underline underline-offset-4">
                  {card.link.label}
                </CardContent>
              )}
            </Card>
          )
          if (href) {
            return (
              <Link
                key={i}
                href={href}
                className="group cursor-pointer no-underline block h-full"
                {...(card.link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {cardInner}
              </Link>
            )
          }
          return <div key={i}>{cardInner}</div>
        })}
      </div>
    </section>
  )
}
