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
                {
                  name: 'logoLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (Light)',
                  admin: {
                    description: "Alt text will be taken from the media item's alt field",
                  },
                },
                {
                  name: 'logoDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (Dark)',
                  admin: {
                    description: "Alt text will be taken from the media item's alt field",
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'faviconLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon (Light)',
                  admin: {
                    description: 'Used as favicon and apple-touch-icon',
                  },
                },
                {
                  name: 'faviconDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Favicon (Dark)',
                  admin: {
                    description: 'Used as favicon and apple-touch-icon',
                  },
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
