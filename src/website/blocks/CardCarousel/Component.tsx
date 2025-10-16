'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { CardCarouselBlock as CardCarouselBlockType } from '@/payload-types'
import { Card, CardVariant } from '@/website/components/Card/CustomCard'
import { cn } from '@/cms/utilities/ui'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { Button } from '@site/components/elements/button'

type Props = CardCarouselBlockType & { className?: string }

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
            const variantRaw =
              colorMode === 'per-card' ? card.cardBackgroundColor : cardBackgroundColor
            const variant =
              typeof variantRaw === 'string' && variantRaw !== ''
                ? (variantRaw as CardVariant)
                : 'default'

            return (
              <div key={i} className="slide px-2" style={{ width: slideWidth }}>
                <Card key={i} variant={variant} card={card}></Card>
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 top-1/2 flex justify-between pointer-events-none">
        <Button
          variant={'arrow'}
          className="-ml-14"
          icon={IconArrowLeft}
          iconSize={36}
          onClick={prev}
          disabled={currentIndex === 0}
        />
        <Button
          variant={'arrow'}
          className="-mr-14"
          icon={IconArrowRight}
          iconSize={36}
          onClick={next}
          disabled={currentIndex >= pageCount - 1}
        />
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
