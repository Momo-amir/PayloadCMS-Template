import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { MediaGalleryBlock as MediaGalleryBlockComponent } from './Component'

export const MediaGalleryBlock: ComponentBlock = {
  slug: 'mediaGalleryBlock',
  dbName: 'mediaGallery',
  component: MediaGalleryBlockComponent,
  imageURL: '/assets/block-icons/mediaContent.svg',
  interfaceName: 'MediaGalleryBlock',
  labels: {
    singular: { en: 'Media Gallery', da: 'Mediegalleri' },
    plural: { en: 'Media Galleries', da: 'Mediegallerier' },
  },
  fields: [
    {
      name: 'introContent',
      localized: true,
      type: 'richText',
      defaultValue: EMPTY_LEXICAL_CONTENT,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'masonry',
      options: [
        { label: 'Masonry', value: 'masonry' },
        { label: 'Bento', value: 'bento' },
      ],
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 2,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
          required: false,
          admin: {
            description: 'Optional caption shown as an overlay on hover.',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Featured (Bento layout only)',
          defaultValue: false,
          admin: {
            description: 'Spans a larger tile in the Bento layout. Has no effect in Masonry.',
          },
        },
      ],
    },
  ],
}
