import type { CollectionConfig } from 'payload'

export const AnalyticsAggregates: CollectionConfig = {
  slug: 'analytics-aggregates',
  admin: {
    useAsTitle: 'event_name',
    defaultColumns: ['event_name', 'count', 'date'],
    group: 'Analytics',
    description: 'Aggregated analytics (GDPR-friendly, no PII)',
    hidden: true, // Hidden from nav - access via custom dashboard
  },
  access: {
    read: ({ req: { user } }) => (user && user.roles?.includes('admin')) || false,
    create: () => true,
    update: () => true,
    delete: ({ req: { user } }) => (user && user.roles?.includes('admin')) || false,
  },
  fields: [
    {
      name: 'event_name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'page_path',
      type: 'text',
      index: true,
      admin: {
        description: 'Normalized path (no IDs or query strings)',
      },
    },
    {
      name: 'count',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: {
        description: 'Date bucket for aggregation',
      },
    },
    {
      name: 'country',
      type: 'text',
      index: true,
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Aggregated event data (no PII)',
      },
    },
  ],
  timestamps: true,
}
