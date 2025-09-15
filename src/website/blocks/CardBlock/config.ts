import { link } from '@/cms/fields/link'
import { createColorPaletteField } from '@/cms/fields/colorPalette'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { CardBlock as CardBlockComponent } from './Component'

export const CardBlock: ComponentBlock = {
  slug: 'cardBlock',
  component: CardBlockComponent,
  interfaceName: 'CardBlock',
  labels: {
    singular: 'Card Layout',
    plural: 'Card Layout',
  },
  fields: [
    createColorPaletteField({
      name: 'cardBackgroundColor',
      label: 'Default Card Background Color',
      description: 'Applied to all cards unless individually overridden.',
    }),
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
          name: 'overrideColor',
          type: 'checkbox',
          label: 'Override Default Color',
          defaultValue: false,
          admin: {
            description: 'Check to use a custom color palette for this specific card.',
          },
        },
        createColorPaletteField({
          name: 'cardBackgroundColor',
          label: 'Custom Card Background Color',
          description: 'Color palette for this individual card.',
          condition: (siblingData) => siblingData?.overrideColor === true,
        }),
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
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Optional media (image or video) to show at top of card',
          },
        },
        link({ appearances: ['default', 'link', 'outline'] }),
      ],
    },
  ],
}
