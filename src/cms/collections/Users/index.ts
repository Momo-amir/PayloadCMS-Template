import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel, isAdminOrEditor } from '../../access/isAdmin'
import { isAdminOrSelf } from '../../access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 0,
  },
  admin: {
    useAsTitle: 'firstName',
  },
  access: {
    // Only admins can create users (editors cannot create accounts)
    create: isAdmin,
    // Read: admins all; editors all; others only themselves
    read: ({ req }) => {
      if (!req.user) return false
      const roles = req.user.roles || []
      if (roles.includes('admin') || roles.includes('editor')) return true
      return { id: { equals: req.user.id } }
    },
    // Update: admins any; editor may update only themselves
    update: isAdminOrSelf,
    // Delete: only admins
    delete: isAdmin,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      access: {
        // Only admins can create or update a value for this field
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
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
      ],
    },
  ],
}
