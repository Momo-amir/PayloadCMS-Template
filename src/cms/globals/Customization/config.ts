import type { GlobalConfig } from 'payload'
import { revalidateCustomization } from './hooks/revalidateCustomization'

export const CustomizationGlobal: GlobalConfig = {
  slug: 'customization',
  access: { read: () => true },
  label: {
    en: 'Customization',
    da: 'Tilpasning',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          type: 'group',
          label: {
            en: 'Choose frontpage',
            da: 'Vælg forside',
          },
          admin: {
            width: '50%',
          },
          fields: [
            {
              name: 'homePage',
              type: 'relationship',
              relationTo: 'pages',
              localized: true,
              required: true,
              label: {
                en: 'Home Page',
                da: 'Forside',
              },
            },
          ],
        },
        {
          type: 'group',
          label: {
            en: 'Choose Post page',
            da: 'Vælg Indlægs side',
          },
          admin: {
            width: '50%',
          },
          fields: [
            {
              name: 'postsPage',
              type: 'relationship',
              relationTo: 'pages',
              label: {
                en: 'Posts parent page',
                da: 'Overordnet side for indlæg',
              },
              admin: {
                description: {
                  en: 'e.g. your "Content Hub" page. Posts will be at {page-path}/{post-slug}.',
                  da: 'f.eks. din "Content Hub"-side. Indlæg vil ligge på {side-sti}/{indlæg-slug}.',
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          type: 'group',
          label: {
            en: 'Branding',
            da: 'Branding',
          },
          admin: {
            width: '50%',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  type: 'group',
                  label: {
                    en: 'Logos',
                    da: 'Logoer',
                  },
                  admin: {
                    width: '50%',
                  },
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
                  type: 'group',
                  label: {
                    en: 'Favicons',
                    da: 'Favikoner',
                  },
                  admin: {
                    width: '50%',
                  },
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
    },
  ],
  hooks: {
    afterChange: [revalidateCustomization],
  },
}
