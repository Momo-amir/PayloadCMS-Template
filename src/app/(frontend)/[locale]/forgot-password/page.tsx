import type { Metadata } from 'next'
import type { TypedLocale } from 'payload'

import { redirect } from 'next/navigation'
import { getCustomization, getLoginPagePath } from '@/cms/utilities/customization'

type Args = {
  params: Promise<{ locale: TypedLocale }>
}

// Forgot-password is now a view of the login block. Forward to the login page with ?view=forgot.
export default async function ForgotPasswordPage({ params }: Args) {
  const { locale } = await params
  const customization = await getCustomization(locale)()
  redirect(`${getLoginPagePath(customization)}?view=forgot`)
}

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your password.',
}
