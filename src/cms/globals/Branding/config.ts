import type { GlobalConfig } from 'payload'
import { revalidateBranding } from './hooks/revalidateBranding'

export const BrandingGlobal: GlobalConfig = {
  slug: 'branding',
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Logos & Icons',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'logoLight', type: 'upload', relationTo: 'media', label: 'Logo (Light)' },
                { name: 'logoDark', type: 'upload', relationTo: 'media', label: 'Logo (Dark)' },
              ],
            },
            { name: 'logoAlt', type: 'text', label: 'Logo Alt' },
            {
              type: 'row',
              fields: [
                {
                  name: 'faviconLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon (Light)',
                },
                {
                  name: 'faviconDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon (Dark)',
                },
              ],
            },
          ],
        },
        {
          label: 'Theme',
          fields: [
            {
              name: 'resetButton',
              type: 'ui',
              admin: {
                components: {
                  Field:
                    '@/cms/globals/Branding/components/ResetThemeColorsButton#ResetThemeColorsButton',
                },
                custom: {
                  globalSlug: 'branding',
                },
              },
            },
            {
              name: 'themeColors',
              label: 'Theme Colors',
              type: 'group',
              admin: {
                description:
                  'Dark mode is always enabled. Toggle editing to customize colors for light and dark themes.',
              },
              fields: [
                {
                  name: 'enableCustomColors',
                  label: 'Enable Custom Color Editing',
                  type: 'checkbox',
                  admin: {
                    description:
                      'Enable this to show color editing fields for light and dark themes.',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'light',
                      label: 'Light Palette',
                      type: 'group',
                      admin: {
                        width: '50%',
                        condition: (data) => data?.themeColors?.enableCustomColors === true,
                      },
                      fields: [
                        {
                          name: 'primary',
                          label: 'Primary',
                          type: 'text',
                          defaultValue: '#09090d',
                          admin: { width: '50%', placeholder: '#09090d' },
                        },
                        {
                          name: 'secondary',
                          label: 'Secondary',
                          type: 'text',
                          defaultValue: '#1f2344',
                          admin: { width: '50%', placeholder: '#1f2344' },
                        },
                        {
                          name: 'tertiary',
                          label: 'Tertiary',
                          type: 'text',
                          defaultValue: '#35296b',
                          admin: { width: '50%', placeholder: '#35296b' },
                        },
                        {
                          name: 'base',
                          label: 'Base',
                          type: 'text',
                          defaultValue: '#ffffff',
                          admin: { width: '50%', placeholder: '#ffffff' },
                        },
                        {
                          name: 'accent1',
                          label: 'Accent 1',
                          type: 'text',
                          defaultValue: '#c4f5fa',
                          admin: { width: '50%', placeholder: '#c4f5fa' },
                        },
                        {
                          name: 'accent2',
                          label: 'Accent 2',
                          type: 'text',
                          defaultValue: '#bca4ea',
                          admin: { width: '50%', placeholder: '#bca4ea' },
                        },
                        {
                          name: 'accent3',
                          label: 'Accent 3',
                          type: 'text',
                          defaultValue: '#fb823b',
                          admin: { width: '50%', placeholder: '#fb823b' },
                        },
                        {
                          name: 'border',
                          label: 'Border',
                          type: 'text',
                          defaultValue: '#d9d9d9',
                          admin: { width: '50%', placeholder: '#d9d9d9' },
                        },
                        {
                          name: 'neutral',
                          label: 'Neutral',
                          type: 'text',
                          defaultValue: '#f5efe1',
                          admin: { width: '50%', placeholder: '#f5efe1' },
                        },
                        {
                          name: 'neutral2',
                          label: 'Neutral 2',
                          type: 'text',
                          defaultValue: '#f8d4a2',
                          admin: { width: '50%', placeholder: '#f8d4a2' },
                        },
                        {
                          name: 'highlight',
                          label: 'Highlight',
                          type: 'text',
                          defaultValue: '#fcf1c3',
                          admin: { width: '50%', placeholder: '#fcf1c3' },
                        },
                        {
                          name: 'highlight2',
                          label: 'Highlight 2',
                          type: 'text',
                          defaultValue: '#e5fcfb',
                          admin: { width: '50%', placeholder: '#e5fcfb' },
                        },
                      ],
                    },
                    {
                      name: 'dark',
                      label: 'Dark Palette',
                      type: 'group',
                      admin: {
                        width: '50%',
                        condition: (data) => data?.themeColors?.enableCustomColors === true,
                      },
                      fields: [
                        {
                          name: 'primary',
                          label: 'Primary',
                          type: 'text',
                          defaultValue: '#e8e8e8',
                          admin: { width: '50%', placeholder: '#e8e8e8' },
                        },
                        {
                          name: 'secondary',
                          label: 'Secondary',
                          type: 'text',
                          defaultValue: '#1f2344',
                          admin: { width: '50%', placeholder: '#1f2344' },
                        },
                        {
                          name: 'tertiary',
                          label: 'Tertiary',
                          type: 'text',
                          defaultValue: '#35296b',
                          admin: { width: '50%', placeholder: '#35296b' },
                        },
                        {
                          name: 'base',
                          label: 'Base',
                          type: 'text',
                          defaultValue: '#09090d',
                          admin: { width: '50%', placeholder: '#09090d' },
                        },
                        {
                          name: 'accent1',
                          label: 'Accent 1',
                          type: 'text',
                          defaultValue: '#c4f5fa',
                          admin: { width: '50%', placeholder: '#c4f5fa' },
                        },
                        {
                          name: 'accent2',
                          label: 'Accent 2',
                          type: 'text',
                          defaultValue: '#bca4ea',
                          admin: { width: '50%', placeholder: '#bca4ea' },
                        },
                        {
                          name: 'accent3',
                          label: 'Accent 3',
                          type: 'text',
                          defaultValue: '#fb823b',
                          admin: { width: '50%', placeholder: '#fb823b' },
                        },
                        {
                          name: 'border',
                          label: 'Border',
                          type: 'text',
                          defaultValue: '#d9d9d9',
                          admin: { width: '50%', placeholder: '#d9d9d9' },
                        },
                        {
                          name: 'neutral',
                          label: 'Neutral',
                          type: 'text',
                          defaultValue: '#f5efe1',
                          admin: { width: '50%', placeholder: '#f5efe1' },
                        },
                        {
                          name: 'neutral2',
                          label: 'Neutral 2',
                          type: 'text',
                          defaultValue: '#f8d4a2',
                          admin: { width: '50%', placeholder: '#f8d4a2' },
                        },
                        {
                          name: 'highlight',
                          label: 'Highlight',
                          type: 'text',
                          defaultValue: '#fcf1c3',
                          admin: { width: '50%', placeholder: '#fcf1c3' },
                        },
                        {
                          name: 'highlight2',
                          label: 'Highlight 2',
                          type: 'text',
                          defaultValue: '#e5fcfb',
                          admin: { width: '50%', placeholder: '#e5fcfb' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateBranding],
  },
}
