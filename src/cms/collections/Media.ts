import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { en: 'Media', da: 'Medie' },
    plural: { en: 'Media', da: 'Medier' },
  },
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../../public/media'),
    focalPoint: true,
    formatOptions: {
      format: 'webp',
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        crop: 'center',
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'small',
        width: 600,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: '2k',
        width: 2560,
        formatOptions: {
          format: 'webp',
        },
      },

      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: {
          format: 'webp',
        },
      },
    ],
  },
}
