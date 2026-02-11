import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { link } from '@/cms/fields/link'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { CardBlock as CardBlockComponent } from './Component'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'

export const CardBlock: ComponentBlock = {
  slug: 'cardBlock',
  component: CardBlockComponent,
  imageURL: '/assets/block-icons/card-grid.svg',
  interfaceName: 'CardBlock',
  labels: {
    singular: 'Card Layout',
    plural: 'Card Layout',
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
      name: 'cardType',
      label: 'Card Type',
      type: 'radio',
      defaultValue: 'link',
      options: [
        { label: 'Info (No Link)', value: 'info' },
        { label: 'Link (Clickable)', value: 'link' },
      ],
    },
    {
      name: 'cardBackgroundColor',
      label: 'Card Variant',
      type: 'select',
      options: [
        { label: 'Default', value: '' },
        { label: 'Dark', value: 'dark' },
        { label: 'Purple', value: 'accent' },
        { label: 'Pink', value: 'accentThree' },
        { label: 'Blue', value: 'secondary' },
        { label: 'Gray', value: 'neutral' },
      ],
    },

    {
      name: 'cards',
      type: 'array',
      required: false,
      minRows: 1,
      labels: {
        singular: 'Card',
        plural: 'Cards',
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.cardType !== 'info',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: false,
          label: 'Tag',
          admin: {
            description: 'Optional label to show above the title (e.g., "New", "Featured").',
            width: '50%',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        link({ appearances: false }),
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Optional media (image or video) to show at top of card',
          },
        },
      ],
    },
    {
      name: 'infoCards',
      type: 'array',
      required: false,
      minRows: 1,
      labels: {
        singular: 'Card',
        plural: 'Cards',
      },
      admin: {
        condition: (_data, siblingData) => siblingData?.cardType === 'info',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: false,
          label: 'Tag',
          admin: {
            description: 'Optional label to show above the title (e.g., "New", "Featured").',
            width: '50%',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Optional media (image or video) to show at top of card',
          },
        },
      ],
    },
  ],
}
