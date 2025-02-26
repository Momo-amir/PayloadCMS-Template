import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const VideoLibrary: CollectionConfig = {
  slug: 'video-library',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },

  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  upload: {
    mimeTypes: ['video/*'],
    // Upload to the public/videos directory in Next.js making them publicly accessible
    staticDir: path.resolve(dirname, '../../public/videos'),
    focalPoint: false,
  },
}
