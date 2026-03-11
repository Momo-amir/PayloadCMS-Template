import type { GlobalConfig } from 'payload'

import { link } from '@/cms/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  admin: {},
  fields: [
    {
      name: 'showLanguageSwitcher',
      type: 'checkbox',
      label: {
        en: 'Show Language Switcher',
        da: 'Vis sprogskifter',
      },
      defaultValue: false,
      admin: {
        description: {
          en: 'Toggle the language switcher in the header. Useful for controlling localization features.',
          da: 'Slå sprogskifteren til eller fra i headeren. Nyttigt til at styre lokaliseringsfunktioner.',
        },
      },
    },
    {
      name: 'navItems',
      type: 'array',
      label: { en: 'Navigation Items', da: 'Menupunkt' },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/website/layout/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
