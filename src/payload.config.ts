// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, LocalizationConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { da } from '@payloadcms/translations/languages/da'
import { en } from '@payloadcms/translations/languages/en'

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

import exports from './website/blocks/exports'
import localization from './i18n/localization'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    // Postgres-specific arguments go here.
    // `pool` is required.
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  collections: [Pages, Posts, Media, Categories, Users, People],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, BrandingGlobal],
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
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
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
  },

  localization: localization as LocalizationConfig,
})
