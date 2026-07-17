import type { FieldAccess } from 'payload'
import { checkRole } from './checkRole'

export const adminOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  return user ? checkRole(['admin'], user) : false
}
