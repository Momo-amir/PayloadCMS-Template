import type { GlobalConfig } from 'payload'
import { link } from '@/cms/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },

  admin: {},
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'cvr',
          type: 'text',
          localized: true,
          label: { en: 'CVR Number', da: 'CVR-nummer' },
          admin: {
            width: '33%',
          },
        },
        {
          name: 'tel',
          type: 'text',
          localized: true,
          label: { en: 'Phone Number', da: 'Telefonnummer' },
          admin: {
            width: '33%',
          },
        },
        {
          name: 'contact',
          type: 'email',
          localized: true,
          label: { en: 'Email Address', da: 'E-mailadresse' },
          admin: {
            width: '33%',
          },
        },
      ],
    },
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
      name: 'socialLinks',
      type: 'array',
      label: { en: 'Social Links', da: 'Sociale links' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: { en: 'Social Platform', da: 'Social platform' },
              required: true,
              options: [
                { label: { en: 'Facebook', da: 'Facebook' }, value: 'facebook' },
                { label: { en: 'Twitter/X', da: 'Twitter/X' }, value: 'twitter' },
                { label: { en: 'Instagram', da: 'Instagram' }, value: 'instagram' },
                { label: { en: 'LinkedIn', da: 'LinkedIn' }, value: 'linkedin' },
                { label: { en: 'YouTube', da: 'YouTube' }, value: 'youtube' },
                { label: { en: 'GitHub', da: 'GitHub' }, value: 'github' },
                { label: { en: 'TikTok', da: 'TikTok' }, value: 'tiktok' },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: { en: 'URL', da: 'URL' },
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: { en: 'Open in new tab', da: 'Åbn i ny fane' },
          defaultValue: true,
        },
      ],
      maxRows: 10,
      admin: {
        initCollapsed: true,
      },
    },

    {
      name: 'themeMode',
      type: 'select',
      label: { en: 'Force Light or Dark Mode', da: 'Tving lyst eller mørkt tema' },
      defaultValue: 'dark',
      options: [
        { label: { en: 'Light', da: 'Lyst' }, value: 'light' },
        { label: { en: 'Dark', da: 'Mørkt' }, value: 'dark' },
      ],
      admin: {
        description: {
          en: 'By default the footer is using dark mode, but you can override that here.',
          da: 'Som standard bruger footeren mørk tilstand, men du kan tilsidesætte det her.',
        },
        width: '50%',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
