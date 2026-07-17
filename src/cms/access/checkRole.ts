import type { User } from '@/payload-types'

export const checkRole = (roles: User['roles'] = [], user?: User | null): boolean => {
  if (!user || !roles) return false
  return roles.some((role) => user.roles?.includes(role))
}
