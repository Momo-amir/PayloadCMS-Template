// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, LocalizationConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { da } from '@payloadcms/translations/languages/da'
import { en } from '@payloadcms/translations/languages/en'
import daMessages from './i18n/messages/da.json'
import enMessages from './i18n/messages/en.json'

import { Categories } from './cms/collections/Categories'
import { Media } from './cms/collections/Media'
import { Pages } from './cms/collections/Pages'
import { Posts } from './cms/collections/Posts'
import { Users } from './cms/collections/Users'
import { Footer } from './website/layout/Footer/config'
import { Header } from './website/layout/Header/config'
import { plugins } from './cms/plugins'
import { BrandingGlobal } from './cms/globals/Branding/config'
import { defaultLexical } from '@/cms/fields/defaultLexical'
import { getServerSideURL } from './cms/utilities/getURL'
import { People } from './cms/collections/People'

// Server-side analytics
import { ConsentTokens } from './cms/collections/ConsentTokens'
import { AnalyticsAggregates } from './cms/collections/AnalyticsAggregates'
import { AnalyticsConfig } from './cms/globals/AnalyticsConfig/config'

// Analytics jobs
import {
  aggregateEventTask,
  forwardToGA4Task,
  forwardToMatomoTask,
} from './cms/jobs/analytics-tasks'
import { processAnalyticsEventWorkflow } from './cms/jobs/analytics-workflow'
import { cleanupOldJobsTask } from './cms/jobs/cleanup-task'
import { cleanupJobsWorkflow } from './cms/jobs/cleanup-workflow'

import exports from './website/blocks/exports'
import localization from './i18n/localization'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const buildPluginRedirectsTranslations = (messages: Record<string, string>) => ({
  'plugin-redirects': {
    fromUrl: messages['plugin-redirects:fromUrl'],
    toUrlType: messages['plugin-redirects:toUrlType'],
    internalLink: messages['plugin-redirects:internalLink'],
    customUrl: messages['plugin-redirects:customUrl'],
    documentToRedirect: messages['plugin-redirects:documentToRedirect'],
    redirectType: messages['plugin-redirects:redirectType'],
  },
})

export default buildConfig({
  blocks: exports.blocks,
  admin: {
    meta: {
      icons: [
        {
          rel: 'icon',
          type: 'image/svg',
          url: '/assets/favicon-lightmode.svg',
          media: '(prefers-color-scheme: light)',
        },
        {
          rel: 'icon',
          type: 'image/svg',
          url: '/assets/favicon-darkmode.svg',
          media: '(prefers-color-scheme: dark)',
        },
      ],
    },
    components: {
      graphics: {
        Icon: '@/cms/components/DashboardGraphics/DashboardIcon.tsx',
        Logo: '@/cms/components/DashboardGraphics/DashboardLogo.tsx',
      },
    },
    dashboard: {
      widgets: [
        {
          slug: 'analytics-events',
          ComponentPath: '@/cms/components/widgets/AnalyticsEventsWidget.tsx#default',
          minWidth: 'medium' as const,
          maxWidth: 'full' as const,
        },
        {
          slug: 'analytics-overview',
          ComponentPath: '@/cms/components/widgets/EventTrackerGraph.tsx#default',
          minWidth: 'medium' as const,
          maxWidth: 'full' as const,
        },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  collections: [Pages, Posts, Media, Categories, Users, People, ConsentTokens, AnalyticsAggregates],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, BrandingGlobal, AnalyticsConfig],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint manually
        if (req.user) return true

        // Authorization header runs automatically (e.g., cron jobs)
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [aggregateEventTask, forwardToGA4Task, forwardToMatomoTask, cleanupOldJobsTask],
    workflows: [processAnalyticsEventWorkflow, cleanupJobsWorkflow],
    // Auto-run processes queued jobs every 5 minutes
    autoRun: [
      {
        cron: '*/5 * * * *', // Process analytics events every 5 minutes
        limit: 100,
        queue: 'default',
      },
    ],
  },

  //Email config - using nodemailer TODO hook up to sendgrid or similar - when ready hooks available with req.payload.sendEmail() etc
  email:
    process.env.MAIL_ENABLED == 'true'
      ? nodemailerAdapter({
          defaultFromAddress: process.env.MAIL_FROM_ADDRESS || 'info@example.com',
          defaultFromName: process.env.MAIL_FROM_NAME || 'Kollab',
          transportOptions: {
            secure: process.env.MAIL_SECURE == 'true',
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          },
        })
      : undefined,

  i18n: {
    supportedLanguages: { da, en },
    fallbackLanguage: 'en',
    translations: {
      da: {
        ...buildPluginRedirectsTranslations(daMessages),
        general: {
          noResults:
            'Ingen {{label}} fundet. Enten findes der endnu ingen {{label}}, eller også matcher ingen af de filtre angivet ovenfor.',
        },
      },
      en: {
        ...buildPluginRedirectsTranslations(enMessages),
      },
    },
  },

  localization: localization as LocalizationConfig,
})
