import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { hero } from '@/website/layout/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import blockExports from '@site/blocks/exports'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { ComponentBlock } from '@/website/types/ComponentBlock'
import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs'

const layoutBlocks: ComponentBlock[] = []

blockExports.blocks.forEach((block) => {
  if (block.showOnPage !== false) layoutBlocks.push(block)
})

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: {
    singular: { en: 'Page', da: 'Side' },
    plural: { en: 'Pages', da: 'Sider' },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt', 'status'],
    livePreview: {
      url: ({ data, req, locale }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
          locale,
        }),
    },
    preview: (data, { req, locale }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
        locale,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              localized: true,
              blocks: layoutBlocks,
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },

        {
          name: 'meta',
          label: 'SEO',
          localized: true,
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
        {
          fields: [
            slugField({
              overrides: (field) => {
                ;(field.fields[1] as { label?: string }).label = 'Page URL'
                return field
              },
            }),
            {
              name: 'publishedAt',
              type: 'date',
            },
            createParentField('pages', {
              admin: {
                position: undefined,
              },
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
          ],
          label: 'Page Settings',
        },
      ],
    },
    createBreadcrumbsField('pages', {
      admin: {
        condition: (data) => Boolean(data?.parent),
      },
    }),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 800, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
