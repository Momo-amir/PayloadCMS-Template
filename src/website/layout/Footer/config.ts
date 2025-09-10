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
      options: [
        { label: 'Default', value: '' },
        { label: 'Dark', value: 'bg-base text-primary' },
        { label: 'Secondary', value: 'bg-secondary text-primary' },
        { label: 'Tertiary', value: 'bg-tertiary text-accent2' },
        { label: 'White', value: 'bg-base text-primary light' },
        { label: 'Neutral', value: 'bg-neutral text-primary' },
        { label: 'Accent', value: 'bg-accent text-primary' },
        { label: 'Accent 2', value: 'bg-accent2 text-primary' },
        { label: 'Accent 3', value: 'bg-accent3 text-base' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
