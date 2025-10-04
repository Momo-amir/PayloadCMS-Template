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
      type: 'row',
      fields: [
        {
          name: 'cvr',
          type: 'text',
          label: 'CVR Number',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'tel',
          type: 'text',
          label: 'Phone Number',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'contact',
          type: 'email',
          label: 'Email Address',
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
      label: 'Social Links',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              label: 'Social Platform',
              required: true,
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Twitter/X', value: 'twitter' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'GitHub', value: 'github' },
                { label: 'TikTok', value: 'tiktok' },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
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
          label: 'Open in new tab',
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
