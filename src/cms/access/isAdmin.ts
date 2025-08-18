import type { Access, FieldAccess } from 'payload'

// Collection-level access: allow only admins
export const isAdmin: Access = ({ req }) => {
  return Boolean(req.user?.roles?.includes('admin'))
}

// Field-level access: allow only admins to create / update the field
export const isAdminFieldLevel: FieldAccess = ({ req }) => {
  return Boolean(req.user?.roles?.includes('admin'))
}

// Helper: allow admins or editors (can be reused elsewhere)
export const isAdminOrEditor: Access = ({ req }) => {
  const roles = req.user?.roles || []
  return roles.includes('admin') || roles.includes('editor')
}
