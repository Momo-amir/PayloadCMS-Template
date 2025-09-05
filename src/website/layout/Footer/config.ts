import type { GlobalConfig } from 'payload'

import { link } from '@/cms/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

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
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Color Palette',
      defaultValue: '',
      options: [
        { label: 'None', value: '' },
        { label: 'Primary', value: 'bg-primary text-base ' },
        { label: 'Dark Blue', value: 'bg-secondary text-white' },
        { label: 'Purple', value: 'bg-tertiary text-accent2' },
        { label: 'Base', value: 'bg-base' },
        { label: 'Yellow', value: 'bg-highlight text-accent3' },
        { label: 'Peach', value: 'bg-highlight2 text-accent3' },
        { label: 'Light blue', value: 'bg-accent text-secondary' },
        { label: 'Light purple', value: 'bg-accent2 text-tertiary' },
        { label: 'Orange', value: 'bg-accent3 text-highlight2' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
