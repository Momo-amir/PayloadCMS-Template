import type { CollectionConfig } from 'payload'

export const ConsentTokens: CollectionConfig = {
  slug: 'consent-tokens',
  admin: {
    useAsTitle: 'token',
    defaultColumns: ['token', 'analytics', 'updated_at'],
    group: 'Privacy',
    description: 'User consent preferences (pseudonymous)',
    hidden: true, // Hidden from nav - programmatic data only
  },
  access: {
    read: ({ req: { user } }) => (user && user.roles?.includes('admin')) || false,
    create: ({ req: { user } }) => (user && user.roles?.includes('admin')) || false,
    update: ({ req: { user } }) => (user && user.roles?.includes('admin')) || false,
    delete: ({ req: { user } }) => (user && user.roles?.includes('admin')) || false,
  },
  fields: [
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'UUID stored in HttpOnly cookie',
      },
    },
    {
      name: 'analytics',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        description: 'User consent for analytics tracking',
      },
    },
    {
      name: 'version',
      type: 'number',
      defaultValue: 1,
      required: true,
      admin: {
        description: 'Privacy policy version',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      index: true,
      admin: {
        description:
          'Token expiry date (12 months from creation/update). Used for automatic cleanup.',
      },
    },
  ],
  timestamps: true,
}
