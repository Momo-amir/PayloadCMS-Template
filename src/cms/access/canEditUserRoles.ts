// Field-level access: allow only admins editing another user's document.
import type { PayloadRequest } from 'payload'

interface Args {
  req: PayloadRequest
  doc?: any // existing user document when updating
}

export const canEditUserRoles = ({ req, doc }: Args): boolean => {
  const roles: string[] = req.user?.roles || []
  if (!roles.includes('admin')) return false
  if (doc && req.user && req.user.id === doc.id) return false
  return true
}
