import React from 'react'
import type { TypedLocale } from 'payload'

import type { LoginConfig } from '@/payload-types'

import { getCachedGlobal } from '@/cms/utilities/getGlobals'
import { UserLoginClient } from './Component.client'

interface UserLoginProps {
  title?: string
  locale?: TypedLocale
}

export const UserLogin: React.FC<UserLoginProps> = async ({ title, locale }) => {
  const config = (await getCachedGlobal('login-config', 1, locale)()) as LoginConfig

  return <UserLoginClient config={config} title={title} />
}
