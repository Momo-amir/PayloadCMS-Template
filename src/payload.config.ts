// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

import { Categories } from './cms/collections/Categories'
import { ColorPalettes } from './cms/collections/ColorPalettes'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
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
        Icon: '@/cms/components/Graphics/Graphics.tsx',
        Logo: '@/cms/components/Graphics/Logo.tsx',
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

  collections: [Pages, Posts, Media, Categories, Users, ColorPalettes],
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
  email: nodemailerAdapter({
    defaultFromAddress: 'info@example.com',
    defaultFromName: 'Kollab-template',
    transportOptions: {
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    },
  }),
})
