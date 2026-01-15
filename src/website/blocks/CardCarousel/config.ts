import { link } from '@/cms/fields/link'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { CardCarouselBlock as CardCarouselBlockComponent } from './Component'

export const CardCarouselBlock: ComponentBlock = {
  slug: 'cardCarouselBlock',
  component: CardCarouselBlockComponent,
  imageURL: '/assets/block-icons/carousel-horizontal-main.svg',
  interfaceName: 'CardCarouselBlock',
  labels: {
    singular: 'Card Carousel',
    plural: 'Card Carousel',
  },
  fields: [
    {
      name: 'cardBackgroundColor',
      label: 'Card Variant',
      type: 'select',
      dbName: 'bg',
      defaultValue: '',
      options: [
        { label: 'Default', value: '' },
        { label: 'Dark', value: 'dark' },
        { label: 'Purple', value: 'accent' },
        { label: 'Pink', value: 'accentThree' },
        { label: 'Blue', value: 'secondary' },
        { label: 'Gray', value: 'neutral' },
      ],
      admin: {
        description: 'Applies this variant to all cards in the carousel.',
        width: '50%',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: false,
      label: 'Section Heading',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Section Description',
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Card',
        plural: 'Cards',
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
  ],
}
