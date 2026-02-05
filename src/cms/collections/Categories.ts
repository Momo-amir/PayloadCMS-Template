import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { createParentField } from '@payloadcms/plugin-nested-docs'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: { en: 'Category', da: 'Kategori' },
    plural: { en: 'Categories', da: 'Kategorier' },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    createParentField('categories', {
      filterOptions: ({ id }) => {
        if (id) {
          return {
            id: {
              not_equals: id,
            },
            'breadcrumbs.doc': {
              not_in: [id],
            },
          }
        }
        return true
      },
    }),
    slugField({
      position: undefined,
    }),
  ],
}
