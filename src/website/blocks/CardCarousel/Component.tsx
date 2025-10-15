'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { CardCarouselBlock as CardCarouselBlockType, Media } from '@/payload-types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/website/components/elements/card'
import Link from 'next/link'
import { ImageMedia } from '@/website/components/Media/ImageMedia'
import { cn } from '@/cms/utilities/ui'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { cva } from 'class-variance-authority'

type Props = CardCarouselBlockType & { className?: string }

//TODO - The new CustomCard.tsx should be used here instead of redefining the card
//The configuration options are different so take a look at CardLayout for reference

function resolveHref(card: CardCarouselBlockType['cards'][0]): string | undefined {
  const l = card.link
  if (!l) return undefined
  if (l.type === 'custom') return l.url || undefined
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

export const CardCarouselBlock: React.FC<Props> = ({
  heading,
  description,
  cards = [],
  columns,
  cardBackgroundColor,
  colorMode,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const perView = Math.max(1, Math.min(cards.length, columns ?? 1))
  const pageCount = Math.ceil(cards.length / perView)

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (!cards.length) return null

  const goToPage = (page: number) => {
    const clamped = Math.max(0, Math.min(page, pageCount - 1))
    setCurrentIndex(clamped)
  }

  const prev = () => goToPage(currentIndex - 1)
  const next = () => goToPage(currentIndex + 1)

  const slideWidth = containerWidth / perView
  const trackWidth = slideWidth * cards.length
  const offset = -(currentIndex * containerWidth)

  return (
    <section className={cn('container relative')}>
      {heading && <h1 className="text-5xl text-center font-semibold mb-10">{heading}</h1>}
      {description && (
        <div className="w-1/2 mx-auto">
          <p className="text-center mb-16">{description}</p>
        </div>
      )}

      <div ref={containerRef} className="overflow-hidden w-full">
        <div
          className="slide-track flex transition-transform duration-500 ease-in-out"
          style={{
            width: trackWidth,
            transform: `translateX(${offset}px)`,
          }}
        >
          {cards.map((card, i) => {
            const href = resolveHref(card)
            const media = card.media
            const variantRaw =
              colorMode === 'per-card' ? card.cardBackgroundColor : cardBackgroundColor
            const variant =
              typeof variantRaw === 'string' && variantRaw !== ''
                ? (variantRaw as 'default' | 'light' | 'dark' | 'primary' | 'secondary')
                : 'default'

            const wrapperVariants = cva('', {
              variants: {
                variant: {
                  default: 'bg-card',
                  light: 'bg-base',
                  dark: 'bg-accent text-white',
                  primary: 'bg-black border-primary text-white',
                  secondary: 'bg-secondary text-white border-secondary',
                },
              },
              defaultVariants: { variant: 'default' },
            })

            const linkColorVariants = cva('', {
              variants: {
                variant: {
                  default: 'text-primary',
                  light: 'text-primary',
                  dark: 'text-white',
                  primary: 'text-white',
                  secondary: 'text-white',
                },
              },
              defaultVariants: { variant: 'default' },
            })

            const cardInner = (
              <div className="slide px-2" style={{ width: slideWidth }}>
                <Card
                  className={cn(
                    'flex-shrink-0 h-full flex flex-col transition hover:shadow-md',
                    wrapperVariants({ variant }),
                  )}
                >
                  {media && typeof media === 'object' && 'url' in media && (
                    <div className="relative w-full aspect-video overflow-hidden rounded-t-lg">
                      <ImageMedia
                        resource={media as Media}
                        alt={media.alt || card.title}
                        fill
                        imgClassName="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle>{card.title}</CardTitle>
                    {card.description && <CardDescription>{card.description}</CardDescription>}
                  </CardHeader>
                  {card.link && card.link.label && href && (
                    <CardContent className="pt-0 text-sm ">
                      <div className="flex items-center">
                        <span
                          className={cn(
                            'text-lg font-semibold pr-2',
                            linkColorVariants({ variant }),
                          )}
                        >
                          {card.link.label}
                        </span>
                        <IconArrowRight size={24} />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            )

            return href ? (
              <Link key={i} href={href} className="link">
                {cardInner}
              </Link>
            ) : (
              <div key={i}>{cardInner}</div>
            )
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 top-1/2 flex justify-between pointer-events-none">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="cursor-pointer pointer-events-auto -ml-14 w-[48px] h-[48px] rounded-full bg-black text-white shadow disabled:opacity-30"
        >
          <IconArrowLeft size={36} className="mx-auto" />
        </button>
        <button
          onClick={next}
          disabled={currentIndex >= pageCount - 1}
          className="cursor-pointer pointer-events-auto -mr-14 w-[48px] h-[48px] rounded-full bg-black text-white shadow disabled:opacity-30"
        >
          <IconArrowRight size={36} className="mx-auto" />
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: pageCount }).map((_, p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={cn(
              'w-[15px] h-[15px] rounded-full cursor-pointer',
              p === currentIndex ? 'bg-gray-800' : 'bg-gray-200',
            )}
          />
        ))}
      </div>
    </section>
  )
}
