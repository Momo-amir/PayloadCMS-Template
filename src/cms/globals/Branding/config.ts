import type { GlobalConfig } from 'payload'
import { revalidateBranding } from './hooks/revalidateBranding'

export const BrandingGlobal: GlobalConfig = {
  slug: 'branding',
  access: { read: () => true },
  labels: {
    singular: {
      en: 'Branding',
      da: 'Branding',
    },
    plural: {
      en: 'Branding',
      da: 'Branding',
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Logos & Icons',
            da: 'Logoer & Ikoner',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'logoLight',
                  type: 'upload',
                  relationTo: 'media',
                  label: {
                    en: 'Logo (Light)',
                    da: 'Logo (Lys)',
                  },
                  admin: {
                    description: "Alt text will be taken from the media item's alt field",
                  },
                },
                {
                  name: 'logoDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: {
                    en: 'Logo (Dark)',
                    da: 'Logo (Mørk)',
                  },
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
                  label: {
                    en: 'Favicon (Light)',
                    da: 'Favicon (Lys)',
                  },
                  admin: {
                    description: 'Used as favicon and apple-touch-icon',
                  },
                },
                {
                  name: 'faviconDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: {
                    en: 'Favicon (Dark)',
                    da: 'Favicon (Mørk)',
                  },
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
