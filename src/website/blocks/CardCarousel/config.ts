import { link } from '@/cms/fields/link'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { CardCarouselBlock as CardCarouselBlockComponent } from './Component'

export const CardCarouselBlock: ComponentBlock = {
  slug: 'cardCarouselBlock',
  component: CardCarouselBlockComponent,
  interfaceName: 'CardCarouselBlock',
  labels: {
    singular: 'Card Carousel',
    plural: 'Card Carousel',
  },
  fields: [
    {
      name: 'colorMode',
      type: 'select',
      label: 'Color Mode',
      defaultValue: 'block',
      options: [
        { label: 'Single color (all cards)', value: 'block' },
        { label: 'Individual per card', value: 'per-card' },
      ],
      admin: {
        description: 'Choose whether to use one color for all cards or set colors individually.',
        width: '50%',
      },
    },
    {
      name: 'cardBackgroundColor',
      label: 'Card Variant',
      type: 'select',
      defaultValue: '',
      options: [
        { label: 'Default', value: '' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
      ],
      admin: {
        description: 'When Color Mode is set to "Single color", this variant applies to all cards.',
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
          name: 'cardBackgroundColor',
          label: 'Card Variant',
          type: 'select',
          defaultValue: '',
          options: [
            { label: 'Default', value: '' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
          admin: {
            description: 'Used when Color Mode is set to "Individual per card".',
          },
        },
        // Include 'default' because the shared link field sets defaultValue: 'default'
        link({ appearances: ['default', 'link', 'outline'] }),
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
      name: 'columns',
      type: 'number',
      label: 'Columns (desktop)',
      defaultValue: 3,
      min: 1,
      max: 4,
      admin: {
        description: 'Number of columns on large screens.',
      },
    },
  ],
}
