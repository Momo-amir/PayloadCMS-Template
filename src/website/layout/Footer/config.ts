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
      name: 'backgroundColor',
      label: 'Background Color Theme',
      description: 'Choose the color theme for the footer background and text',
    }),
    {
      name: 'themeMode',
      type: 'select',
      label: 'Force Light or Dark Mode',
      defaultValue: 'dark',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      admin: {
        description: 'By default the footer is using dark mode, but you can override that here.',
        width: '50%',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
