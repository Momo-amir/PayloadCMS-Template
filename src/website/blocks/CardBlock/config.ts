import type { Block } from 'payload'
import { link } from '@/cms/fields/link'

export const CardBlock: Block = {
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  labels: {
    singular: 'Card Layout',
    plural: 'Card Layout',
  },
  fields: [
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Color Palette',
      defaultValue: '',
      options: [
        { label: 'None', value: '' },
        { label: 'Primary', value: 'bg-primary' },
        { label: 'Dark Blue', value: 'bg-secondary text-white' },
        { label: 'Purple', value: 'bg-tertiary text-accent2' },
        { label: 'Base', value: 'bg-base' },
        { label: 'Yellow', value: 'bg-highlight text-accent3' },
        { label: 'Peach', value: 'bg-highlight2 text-accent3' },
        { label: 'Light blue', value: 'bg-accent text-secondary' },
        { label: 'Light purple', value: 'bg-accent2 text-tertiary' },
        { label: 'Orange', value: 'bg-accent3 text-highlight2' },
      ],
      admin: { isClearable: false },
    },
    {
      name: 'heading',
      type: 'text',
      required: false,
      label: 'Section Heading',
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
        // Include 'default' because the shared link field sets defaultValue: 'default'
        link({ appearances: ['default', 'link', 'secondary', 'outline'] }),
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
