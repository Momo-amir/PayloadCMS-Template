import type { GlobalConfig } from 'payload'
import { revalidateBranding } from './hooks/revalidateBranding'
import { createThemeColorsGroup } from '@/cms/globals/Branding/fields/themeFields'

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
          fields: [createThemeColorsGroup()],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateBranding],
  },
}
