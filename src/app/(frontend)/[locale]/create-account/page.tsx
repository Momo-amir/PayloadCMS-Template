import type { Metadata } from 'next'
import type { TypedLocale } from 'payload'

import { redirect } from 'next/navigation'
import { getCustomization, getLoginPagePath } from '@/cms/utilities/customization'

type Args = {
  params: Promise<{ locale: TypedLocale }>
}

// Create-account is now a view of the login block. Forward to the login page with ?view=create.
export default async function CreateAccount({ params }: Args) {
  const { locale } = await params
  const customization = await getCustomization(locale)()
  redirect(`${getLoginPagePath(customization)}?view=create`)
}

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create an account to get started.',
}
