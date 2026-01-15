import { link } from '@/cms/fields/link'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { CardBlock as CardBlockComponent } from './Component'

export const CardBlock: ComponentBlock = {
  slug: 'cardBlock',
  component: CardBlockComponent,
  imageURL: '/assets/block-icons/cards.svg',
  interfaceName: 'CardBlock',
  labels: {
    singular: 'Card Layout',
    plural: 'Card Layout',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: false,
      label: 'Section Heading',
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
