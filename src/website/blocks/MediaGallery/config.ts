import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { EMPTY_LEXICAL_CONTENT } from '@/cms/fields/defaultLexical'
import { linkGroup } from '@/cms/fields/linkGroup'
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
        singular: 'Item',
        plural: 'Items',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Tile Type',
          defaultValue: 'media',
          options: [
            { label: 'Media', value: 'media' },
            { label: 'Text', value: 'text' },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type !== 'text',
          },
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
          required: false,
          admin: {
            description: 'Optional caption shown as an overlay on hover.',
            condition: (_, siblingData) => siblingData?.type !== 'text',
          },
        },
        {
          name: 'richText',
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
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'text',
          },
        },
        linkGroup({
          appearances: ['default', 'outline', 'link', 'secondary', 'tertiary'],
          overrides: {
            maxRows: 3,
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'text',
            },
          },
        }),
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
