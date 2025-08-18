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
      admin: {
        isClearable: false,
        condition: (data) => !data?.colorMode || data?.colorMode === 'block',
        description: 'Applied to every card when mode is Single color.',
      },
    },
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
        {
          name: 'cardBackgroundColor',
          type: 'select',
          label: 'Card Color',
          admin: {
            // Always show to avoid conditional rendering glitches; explain usage.
            description: 'Used when Color Mode = Individual per card. Ignored otherwise.',
          },
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
          defaultValue: '',
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
