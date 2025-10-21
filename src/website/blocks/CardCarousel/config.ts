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
      // Short dbName to avoid exceeding Postgres identifier length
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
          name: 'cardBackgroundColor',
          label: 'Card Variant',
          type: 'select',
          // Short dbName to avoid exceeding Postgres identifier length
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
            description: 'Used when Color Mode is set to "Individual per card".',
          },
        },
        // Include 'default' because the shared link field sets defaultValue: 'default'
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
