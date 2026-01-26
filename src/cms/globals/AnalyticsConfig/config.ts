import type { GlobalConfig } from 'payload'

export const AnalyticsConfig: GlobalConfig = {
  slug: 'analytics-config',
  label: 'Analytics Settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => (user && user.roles?.includes('admin')) || false,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Analytics',
    },
    {
      name: 'store_aggregates',
      type: 'checkbox',
      defaultValue: true,
      label: 'Store Aggregated Data',
      admin: {
        description: 'Store anonymized aggregate data in Postgres for reporting',
      },
    },
    {
      name: 'anonymize_ip',
      type: 'checkbox',
      defaultValue: true,
      label: 'Anonymize IP to Country Only',
    },
    {
      name: 'matomo_enabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Forward to Matomo',
      admin: {
        description: 'Configure MATOMO_URL and MATOMO_SITE_ID in environment variables',
      },
    },
    {
      name: 'ga4_enabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Forward to Google Analytics 4',
      admin: {
        description:
          'Configure NEXT_PUBLIC_GA_MEASUREMENT_ID and GA4_API_SECRET in environment variables',
      },
    },
  ],
}
