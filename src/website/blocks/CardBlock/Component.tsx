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

const columnClass = (cols?: number | null) => {
  switch (cols) {
    case 2:
      return 'md:grid-cols-2'
    case 4:
      return 'md:grid-cols-4'
    case 1:
      return 'md:grid-cols-1'
    case 3:
    default:
      return 'md:grid-cols-3'
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

export const CardBlock: React.FC<Props> = ({
  heading,
  cards = [],
  columns,
  backgroundColor,
  colorMode,
}) => {
  const normalizedCols: number | undefined =
    typeof columns === 'number' && !Number.isNaN(columns) ? columns : undefined
  if (!cards.length) return null
  return (
    <section className={cn('container')}>
      {heading && <h2 className="text-3xl font-semibold mb-8">{heading}</h2>}
      <div className={cn('grid gap-8', columnClass(normalizedCols))}>
        {cards.map((card, i) => {
          const href = resolveHref(card)
          const media = card.media
          const appliedBg =
            colorMode === 'per-card'
              ? card.cardBackgroundColor || ''
              : backgroundColor
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
