declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string

      // Analytics Environment Variables
      NEXT_PUBLIC_GA_MEASUREMENT_ID?: string // Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)
      NEXT_PUBLIC_GTM_MEASUREMENT_ID?: string // Google Tag Manager Container ID (e.g., GTM-XXXXXXX)

      // Server-side analytics (private - not exposed to client)
      MATOMO_URL?: string // Matomo instance URL (e.g., https://matomo.example.com)
      MATOMO_SITE_ID?: string // Matomo site ID
      GA4_API_SECRET?: string // GA4 Measurement Protocol API Secret (pairs with NEXT_PUBLIC_GA_MEASUREMENT_ID)
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
