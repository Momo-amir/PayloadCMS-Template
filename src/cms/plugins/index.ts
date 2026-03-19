import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/cms/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/cms/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/cms/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/cms/utilities/getURL'
import { phoneField, privacyPolicyField } from '@/cms/fields/formBuilder'
import { formActionOptions } from '@/cms/forms/actions'
import { copyFormActionToSubmission } from '@/cms/forms/copyFormActionToSubmission'
import { runFormAction } from '@/cms/forms/runFormAction'
import { People } from '../collections/People'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Kollab Website Template` : 'Kollab Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      labels: {
        singular: {
          en: 'Redirect',
          da: 'Omdirigering',
        },
        plural: {
          en: 'Redirects',
          da: 'Omdirigeringer',
        },
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories', 'pages'],
    parentFieldSlug: 'parent',
    breadcrumbsFieldSlug: 'breadcrumbs',
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      phone: phoneField,
      privacyPolicy: privacyPolicyField,
    },
    formOverrides: {
      labels: {
        singular: {
          en: 'Form',
          da: 'Formular',
        },
        plural: {
          en: 'Forms',
          da: 'Formularer',
        },
      },
      fields: ({ defaultFields }) => {
        return defaultFields
          .map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          })
          .concat([
            {
              name: 'action',
              type: 'select',
              label: { en: 'Submission Action', da: 'Indsendelseshandling' },
              options: formActionOptions,
              defaultValue: 'none',
              admin: {
                position: 'sidebar',
                description: {
                  en: 'Used to trigger server-side callbacks when a submission is created.',
                  da: 'Bruges til server-side callbacks, når en indsendelse oprettes.',
                },
              },
            },
            {
              name: 'formPreview',
              type: 'ui',
              admin: {
                position: 'sidebar',
                components: {
                  Field: '@/cms/components/FormPreview/index#FormPreview',
                },
              },
            },
          ])
      },
    },
    formSubmissionOverrides: {
      labels: {
        singular: {
          en: 'Form Submission',
          da: 'Formularindsendelse',
        },
        plural: {
          en: 'Form Submissions',
          da: 'Formularindsendelser',
        },
      },
      fields: ({ defaultFields }) => {
        return defaultFields.concat([
          {
            name: 'action',
            type: 'text',
            admin: {
              hidden: true,
            },
          },
        ])
      },
      hooks: {
        beforeChange: [copyFormActionToSubmission],
        afterChange: [runFormAction],
      },
    },
  }),
  searchPlugin({
    collections: ['posts', 'people'],
    beforeSync: beforeSyncWithSearch,
    localize: true,
    searchOverrides: {
      labels: {
        singular: {
          en: 'Search Result',
          da: 'Søgeresultat',
        },
        plural: {
          en: 'Search Results',
          da: 'Søgeresultater',
        },
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
