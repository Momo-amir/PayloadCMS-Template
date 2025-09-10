import type { GlobalConfig } from 'payload'
import { link } from '@/cms/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { createColorPaletteField } from '@/cms/fields/colorPalette'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/website/layout/Footer/RowLabel#RowLabel',
        },
      },
    },
    createColorPaletteField({
      description: 'Choose the color theme for the footer background and text',
    }),
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
