import React from 'react'
import type { CardBlock as CardBlockType } from '@/payload-types'
import Card from '@/website/components/Card/CustomCard'
import InfoCard from '@/website/components/Card/InfoCard'
import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import RichText from '@/website/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type CardItem = CardBlockType['cards'][number]
type Props = CardBlockType & {
  className?: string
  introContent?: SerializedEditorState
  infoCards?: CardItem[]
}

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

export const CardBlock: React.FC<Props> = ({
  introContent,
  cards = [],
  infoCards = [],
  cardBackgroundColor,
  cardType,
}) => {
  const variant = cardBackgroundColor ? cardBackgroundColor : 'default'
  const CardComponent = cardType === 'info' ? InfoCard : Card
  const resolvedCards = cardType === 'info' ? infoCards : cards

  if (!resolvedCards.length) return null

  return (
    <div className="my-16">
      <TrackImpression
        componentName={`Card Block (${cards.length} cards)`}
        componentType="cards"
        as="section"
      >
        {introContent && (
          <div className="container mb-16">
            <RichText className="ms-0" data={introContent} enableGutter={false} />
          </div>
        )}
        <div className="container">
          <div className={cn('grid gap-8', columnClass(cards.length))}>
            {resolvedCards.map((card, i) => (
              <CardComponent key={card.id ?? i} card={card} variant={variant} />
            ))}
          </div>
        </div>
      </TrackImpression>
    </div>
  )
}
