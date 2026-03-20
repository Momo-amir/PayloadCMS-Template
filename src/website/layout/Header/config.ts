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
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'link',
          options: [
            { label: { en: 'Link', da: 'Link' }, value: 'link' },
            { label: { en: 'Dropdown', da: 'Dropdown' }, value: 'dropdown' },
          ],
          admin: {
            layout: 'horizontal',
          },
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.type !== 'dropdown',
            },
          },
        }),
        {
          name: 'dropdownLabel',
          type: 'text',
          localized: true,
          label: { en: 'Dropdown label', da: 'Dropdown-label' },
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
        },
        {
          name: 'children',
          type: 'array',
          label: { en: 'Dropdown items', da: 'Undermenu' },
          maxRows: 8,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
            initCollapsed: true,
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
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
