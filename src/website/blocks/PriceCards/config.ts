import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { link } from '@/cms/fields/link'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { PriceCardsBlock as PriceCardsBlockComponent } from './Component'

export const PriceCardsBlock: ComponentBlock = {
  slug: 'priceCardsBlock',
  dbName: 'priceCards',
  component: PriceCardsBlockComponent,
  imageURL: '/assets/block-icons/card-grid.svg',
  interfaceName: 'PriceCardsBlock',
  labels: {
    singular: { en: 'Price Cards', da: 'Priskort' },
    plural: { en: 'Price Cards', da: 'Priskort' },
  },
  fields: [
    {
      name: 'introContent',
      localized: true,
      type: 'richText',
      defaultValue: EMPTY_LEXICAL_CONTENT,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'tiers',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      labels: {
        singular: 'Tier',
        plural: 'Tiers',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
          label: 'Plan Name',
        },
        {
          name: 'subheading',
          type: 'text',
          localized: true,
          required: false,
          label: 'Price',
          admin: {
            description: 'e.g. "199 kr/md" or "Contact us".',
          },
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
          required: false,
        },
        {
          name: 'bullets',
          type: 'array',
          required: false,
          minRows: 1,
          labels: {
            singular: 'Bullet',
            plural: 'Bullets',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              localized: true,
              required: true,
            },
          ],
        },
        link({ appearances: false }),
        {
          name: 'highlighted',
          type: 'checkbox',
          label: 'Highlight as recommended',
          defaultValue: false,
        },
      ],
    },
  ],
}
