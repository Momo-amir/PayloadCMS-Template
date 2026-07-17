import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '../../access/isAdmin'
import { isAdminOrSelf } from '../../access/isAdminOrSelf'
import { canEditUserRoles } from '../../access/canEditUserRoles'
import { ensureFirstUserIsAdmin } from '../../access/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'User', da: 'Bruger' },
    plural: { en: 'Users', da: 'Brugere' },
  },
  auth: {
    depth: 0,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    afterOperation: [
      async ({ operation, req }) => {
        if (operation === 'login') {
          const roles: string[] = req.user?.roles || []
          const isPrivileged = roles.includes('admin') || roles.includes('editor')
          // Allow website-origin logins to proceed if special header present. or add an endpoint for this
          const websiteAuth =
            typeof req.headers?.get === 'function' ? req.headers.get('x-website-auth') : undefined
          if (!isPrivileged && !websiteAuth) {
            // Throwing aborts login response for admin panel attempts.
            throw new Error('Unauthorized: standard users must use website login flow.')
          }
        }
      },
    ],
  },
  access: {
    create: () => true,
    // Read: admins + editors can read all; others only themselves.
    read: ({ req }) => {
      if (!req.user) return false
      const roles = req.user.roles || []
      if (roles.includes('admin') || roles.includes('editor')) return true
      return { id: { equals: req.user.id } }
    },
    // Update: admins any; everyone else only themselves.
    update: isAdminOrSelf,
    // Delete: only admins (they may delete themselves if desired).
    delete: isAdmin,
    // Unlock (after failed-login lockout): admins only.
    unlock: isAdmin,
    // Admin UI visibility for this collection (and effectively ability to use the admin panel navigation).
    admin: ({ req }) => {
      const roles = req.user?.roles || []
      return roles.includes('admin') || roles.includes('editor')
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'roles',
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      admin: {
        description: 'User roles. Only admins can edit roles (not their own).',
      },
      access: {
        create: isAdminFieldLevel, // admins setting roles on manual creation
        update: ({ req, doc }) => canEditUserRoles({ req, doc }),
      },
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'User',
          value: 'user',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
      ],
    },
  ],
}
