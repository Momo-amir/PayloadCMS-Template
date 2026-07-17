import type { FieldAccess } from 'payload'
import { checkRole } from './checkRole'

export const customerOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  return user ? checkRole(['customer'], user) : false
}
