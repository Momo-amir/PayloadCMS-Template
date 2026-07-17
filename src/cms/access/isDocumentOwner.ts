import type { Access } from 'payload'
import { checkRole } from './checkRole'

// Admins see everything; authenticated users are scoped to documents they own via the customer field;
// guests are denied. Used by the ecommerce plugin for carts/orders/addresses.
export const isDocumentOwner: Access = ({ req }) => {
  if (req.user && checkRole(['admin'], req.user)) return true
  if (req.user?.id) return { customer: { equals: req.user.id } }
  return false
}
