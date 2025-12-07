import type { GlobalConfig } from 'payload'

import { link } from '@/cms/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { generatePreviewPath } from '@/cms/utilities/generatePreviewPath'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: ({ req }) =>
        generatePreviewPath({
          slug: 'home',
          collection: 'pages',
          req,
        }),
    },
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
          RowLabel: '@/website/layout/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
