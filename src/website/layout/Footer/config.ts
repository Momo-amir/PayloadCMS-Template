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
        { label: 'Primary', value: 'bg-primary text-base' },
        { label: 'Secondary', value: 'bg-secondary text-white' },
        { label: 'Tertiary', value: 'bg-tertiary text-accent2' },
        { label: 'Base', value: 'bg-base' },
        { label: 'Highlight', value: 'bg-highlight text-accent3' },
        { label: 'Highlight 2', value: 'bg-highlight2 text-accent3' },
        { label: 'Accent', value: 'bg-accent text-secondary light-mode' },
        { label: 'Accent 2', value: 'bg-accent2 text-tertiary light-mode' },
        { label: 'Accent 3', value: 'bg-accent3 text-highlight2 light-mode' },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
