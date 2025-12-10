import React from 'react'
import type { CardBlock as CardBlockType } from '@/payload-types'
import Card from '@/website/components/Card/CustomCard'
import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'

type Props = CardBlockType & { className?: string }

const columnClass = (cardCount: number) => {
  switch (cardCount) {
    case 1:
      return 'md:grid-cols-1'
    case 2:
      return 'md:grid-cols-2'
    case 3:
    default:
      return ' md:grid-cols-2 lg:grid-cols-3' // 3+ cards always use 3 columns
  }
}

// Now delegated to Teaser

export const CardBlock: React.FC<Props> = ({ heading, cards = [], cardBackgroundColor }) => {
  const variant = cardBackgroundColor ? cardBackgroundColor : 'default'

  if (!cards.length) return null

  return (
    <TrackImpression
      componentName={`Card Block (${cards.length} cards)`}
      componentType="cards"
      as="section"
      className={cn('container')}
    >
      {heading && <h2 className="text-3xl font-semibold mb-8">{heading}</h2>}
      <div className={cn('grid gap-8', columnClass(cards.length))}>
        {cards.map((card, i) => (
          <Card key={card.id ?? i} card={card} variant={variant} />
        ))}
      </div>
    </TrackImpression>
  )
}
