'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import type { LoginConfig, User } from '@/payload-types'

import { useAuth } from '@/providers/Auth'
import { useTrackClick } from '@/cms/hooks/useAnalytics'
import { getClientSideURL } from '@/cms/utilities/getURL'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { Button } from '@/website/components/elements/button'
import { Input } from '@/website/components/elements/input'
import { Label } from '@/website/components/elements/label'
import { FormError } from '@/website/components/auth/FormError'
import { FormItem } from '@/website/components/auth/FormItem'
import { Message } from '@/website/components/auth/Message'

type Props = {
  config?: Partial<LoginConfig> | null
  title?: string
  loginPath: string
}

const label = (value: string | null | undefined, fallback: string) => value || fallback

export const AccountDetailsClient: React.FC<Props> = ({ config, title, loginPath }) => {
  const { user } = useAuth()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (user === undefined) {
    return <section className="container my-16 max-w-lg" aria-busy="true" />
  }

  if (user === null) {
    const query = searchParams?.toString()
    const currentPath = query ? `${pathname}?${query}` : pathname
    const next = new URLSearchParams()
    if (currentPath && currentPath !== loginPath) next.set('redirect', currentPath)
    const signInHref = next.toString() ? `${loginPath}?${next.toString()}` : loginPath

    return (
      <TrackImpression componentName="AccountDetails" componentType="AccountDetails">
        <section className="container my-16 max-w-lg">
          <div className="rounded-lg border border-border bg-surface p-8">
            <p className="mb-6 text-primary">
              {label(config?.loggedOutMessage, 'You need to sign in to view your account.')}
            </p>
            <Button asChild variant="default">
              <Link href={signInHref}>{label(config?.signInLabel, 'Sign in')}</Link>
            </Button>
          </div>
        </section>
      </TrackImpression>
    )
  }

  return (
    <TrackImpression componentName="AccountDetails" componentType="AccountDetails">
      <section className="container my-16 max-w-lg">
        <h1 className="mb-6 text-3xl font-medium text-primary">
          {title ?? label(config?.accountTitle, 'Your account')}
        </h1>
        {config?.accountIntro && <p className="mb-8 text-primary">{config.accountIntro}</p>}

        <AccountOverview config={config} user={user} />
        <ProfileForm config={config} user={user} />
        <PasswordForm config={config} user={user} />
      </section>
    </TrackImpression>
  )
}

const AccountOverview: React.FC<{
  config?: Partial<LoginConfig> | null
  user: User
}> = ({ config, user }) => {
  const { logout } = useAuth()
  return (
    <div className="mb-8 rounded-lg border border-border bg-surface p-8">
      <dl className="flex flex-col gap-4">
        <div>
          <dt className="text-sm text-primary/60">{label(config?.nameLabel, 'Name')}</dt>
          <dd className="text-primary">{user.name || '—'}</dd>
        </div>
        <div>
          <dt className="text-sm text-primary/60">{label(config?.emailLabel, 'Email')}</dt>
          <dd className="text-primary">{user.email}</dd>
        </div>
      </dl>
      <Button className="mt-6" onClick={() => logout()} variant="ghost">
        {label(config?.logoutLabel, 'Log out')}
      </Button>
    </div>
  )
}

const ProfileForm: React.FC<{
  config?: Partial<LoginConfig> | null
  user: User
}> = ({ config, user }) => {
  const { setUser } = useAuth()
  const trackSaveProfile = useTrackClick('Save profile', 'AccountDetails')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<{ name: string; email: string }>({
    defaultValues: { name: user.name || '', email: user.email },
  })

  useEffect(() => {
    reset({ name: user.name || '', email: user.email })
  }, [user.id, user.name, user.email, reset])

  const onSubmit = handleSubmit(async (data) => {
    trackSaveProfile()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const response = await fetch(`${getClientSideURL()}/api/users/${user.id}`, {
      body: JSON.stringify({ name: data.name, email: data.email }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })
    setLoading(false)
    if (!response.ok) {
      setError('There was an error updating your profile. Please try again.')
      return
    }
    const { doc } = await response.json()
    setUser(doc)
    setSuccess(label(config?.profileSuccessMessage, 'Profile updated.'))
  })

  return (
    <div className="mb-8 rounded-lg border border-border bg-surface p-8">
      <h2 className="mb-6 text-xl font-medium text-primary">
        {label(config?.profileSectionLabel, 'Profile')}
      </h2>

      <form onSubmit={onSubmit}>
        <Message error={error} success={success} />
        <div className="mb-8 flex flex-col gap-8">
          <FormItem>
            <Label htmlFor="account-name">{label(config?.nameLabel, 'Name')}</Label>
            <Input
              id="account-name"
              type="text"
              {...register('name', { required: 'Name is required.' })}
            />
            {errors.name && <FormError message={errors.name.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="account-email">{label(config?.emailLabel, 'Email')}</Label>
            <Input
              id="account-email"
              type="email"
              {...register('email', { required: 'Email is required.' })}
            />
            {errors.email && <FormError message={errors.email.message} />}
          </FormItem>
        </div>

        <Button className="w-full" disabled={loading} size="lg" type="submit" variant="default">
          {loading ? 'Processing' : label(config?.profileSubmitLabel, 'Save changes')}
        </Button>
      </form>
    </div>
  )
}

const PasswordForm: React.FC<{
  config?: Partial<LoginConfig> | null
  user: User
}> = ({ config, user }) => {
  const { login } = useAuth()
  const trackUpdatePassword = useTrackClick('Update password', 'AccountDetails')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [success, setSuccess] = useState<null | string>(null)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<{ currentPassword: string; password: string; passwordConfirm: string }>()
  const passwordValue = watch('password', '')

  const onSubmit = handleSubmit(async (data) => {
    trackUpdatePassword()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // Payload's update endpoint does not verify the old password, so re-authenticate first.
      // Failed attempts count toward the collection's login lockout.
      await login({ email: user.email, password: data.currentPassword })
    } catch (_error) {
      setLoading(false)
      setError('The current password is incorrect.')
      return
    }
    const response = await fetch(`${getClientSideURL()}/api/users/${user.id}`, {
      body: JSON.stringify({ password: data.password }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })
    setLoading(false)
    if (!response.ok) {
      setError('There was an error updating your password. Please try again.')
      return
    }
    reset()
    setSuccess(label(config?.passwordSuccessMessage, 'Password updated.'))
  })

  return (
    <div className="rounded-lg border border-border bg-surface p-8">
      <h2 className="mb-6 text-xl font-medium text-primary">
        {label(config?.passwordSectionLabel, 'Change password')}
      </h2>

      <form onSubmit={onSubmit}>
        <Message error={error} success={success} />
        <div className="mb-8 flex flex-col gap-8">
          <FormItem>
            <Label htmlFor="account-current-password">
              {label(config?.currentPasswordLabel, 'Current password')}
            </Label>
            <Input
              id="account-current-password"
              type="password"
              autoComplete="current-password"
              {...register('currentPassword', {
                required: 'Please provide your current password.',
              })}
            />
            {errors.currentPassword && <FormError message={errors.currentPassword.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="account-new-password">
              {label(config?.newPasswordLabel, 'New password')}
            </Label>
            <Input
              id="account-new-password"
              type="password"
              autoComplete="new-password"
              {...register('password', { required: 'Please provide a new password.' })}
            />
            {errors.password && <FormError message={errors.password.message} />}
          </FormItem>

          <FormItem>
            <Label htmlFor="account-password-confirm">
              {label(config?.passwordConfirmLabel, 'Confirm password')}
            </Label>
            <Input
              id="account-password-confirm"
              type="password"
              autoComplete="new-password"
              {...register('passwordConfirm', {
                required: 'Please confirm your new password.',
                validate: (value) => value === passwordValue || 'The passwords do not match.',
              })}
            />
            {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
          </FormItem>
        </div>

        <Button className="w-full" disabled={loading} size="lg" type="submit" variant="default">
          {loading ? 'Processing' : label(config?.passwordSubmitLabel, 'Update password')}
        </Button>
      </form>
    </div>
  )
}
