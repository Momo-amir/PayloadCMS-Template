import type { Block } from 'payload'
import { link } from '@/cms/fields/link'
import { createColorPaletteField } from '@/cms/fields/colorPalette'

export const CardBlock: Block = {
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  labels: {
    singular: 'Card Layout',
    plural: 'Card Layout',
  },
  fields: [
    createColorPaletteField({
      description: 'Applied to every card when mode is Single color.',
      condition: (data) => !data?.colorMode || data?.colorMode === 'block',
    }),
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
            { label: 'Primary', value: 'bg-primary text-base' },
            { label: 'Secondary', value: 'bg-secondary text-primary' },
            { label: 'Tertiary', value: 'bg-tertiary text-accent2' },
            { label: 'Base', value: 'bg-base text-primary' },
            { label: 'Neutral', value: 'bg-neutral text-primary' },
            { label: 'Accent', value: 'bg-accent text-primary' },
            { label: 'Accent 2', value: 'bg-accent2 text-primary' },
            { label: 'Accent 3', value: 'bg-accent3 text-base' },
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
