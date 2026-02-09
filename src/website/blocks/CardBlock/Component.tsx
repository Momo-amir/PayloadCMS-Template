import React from 'react'
import type { CardBlock as CardBlockType } from '@/payload-types'
import Card from '@/website/components/Card/CustomCard'
import InfoCard from '@/website/components/Card/InfoCard'
import { cn } from '@/cms/utilities/ui'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import RichText from '@/website/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type LinkCardItem = NonNullable<CardBlockType['cards']>[number]
type InfoCardItem = NonNullable<CardBlockType['infoCards']>[number]
type Props = CardBlockType & {
  className?: string
  introContent?: SerializedEditorState
  infoCards?: InfoCardItem[]
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
  cards,
  infoCards,
  cardBackgroundColor,
  cardType,
}) => {
  const variant = cardBackgroundColor ? cardBackgroundColor : 'default'
  const safeCards: LinkCardItem[] = cards ?? []
  const safeInfoCards: InfoCardItem[] = infoCards ?? []

  return (
    <div className="my-16">
      {cardType === 'info' ? (
        safeInfoCards.length ? (
          <TrackImpression
            componentName={`Card Info Block (${safeInfoCards.length} cards)`}
            componentType="cards"
            as="section"
          >
            {introContent && (
              <div className="container mb-16">
                <RichText className="ms-0" data={introContent} enableGutter={false} />
              </div>
            )}
            <div className="container">
              <div className={cn('grid gap-8', columnClass(safeInfoCards.length))}>
                {safeInfoCards.map((card, i) => (
                  <InfoCard key={card.id ?? i} card={card} variant={variant} />
                ))}
              </div>
            </div>
          </TrackImpression>
        ) : null
      ) : safeCards.length ? (
        <TrackImpression
          componentName={`Card Link Block (${safeCards.length} cards)`}
          componentType="cards"
          as="section"
        >
          {introContent && (
            <div className="container mb-16">
              <RichText className="ms-0" data={introContent} enableGutter={false} />
            </div>
          )}
          <div className="container">
            <div className={cn('grid gap-8', columnClass(safeCards.length))}>
              {safeCards.map((card, i) => (
                <Card key={card.id ?? i} card={card} variant={variant} />
              ))}
            </div>
          </div>
        </TrackImpression>
      ) : null}
    </div>
  )
}
