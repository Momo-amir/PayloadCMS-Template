'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import type { LoginConfig, User } from '@/payload-types'

import { useAuth } from '@/providers/Auth'
import { useToast } from '@/providers/Toast'
import { useTrackClick } from '@/cms/hooks/useAnalytics'
import { getClientSideURL } from '@/cms/utilities/getURL'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { Button } from '@/website/components/elements/button'
import { Input } from '@/website/components/elements/input'
import { Label } from '@/website/components/elements/label'
import { FormError } from '@/website/components/auth/FormError'
import { FormItem } from '@/website/components/auth/FormItem'

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
  const trackSignIn = useTrackClick('Sign in', 'Account Details Block')

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
      <TrackImpression componentName="Account Details Block" componentType="account-details">
        <section className="container my-16 max-w-lg">
          <div className="rounded-lg border border-border bg-surface p-8">
            <p className="mb-6 text-primary">
              {label(config?.loggedOutMessage, 'You need to sign in to view your account.')}
            </p>
            <Button asChild variant="default">
              <Link href={signInHref} onClick={() => trackSignIn(signInHref)}>
                {label(config?.signInLabel, 'Sign in')}
              </Link>
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
  const toast = useToast()

  const onLogout = async () => {
    try {
      await logout()
      toast.add({ description: 'You are now signed out.', type: 'success' })
    } catch (_error) {
      toast.add({ description: 'There was an error signing out. Please try again.', type: 'error' })
    }
  }

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
      <Button className="mt-6" onClick={onLogout} variant="ghost">
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
  const toast = useToast()
  const trackSaveProfile = useTrackClick('Save profile', 'Account Details Block')
  const [loading, setLoading] = useState(false)
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
    const response = await fetch(`${getClientSideURL()}/api/users/${user.id}`, {
      body: JSON.stringify({ name: data.name, email: data.email }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })
    setLoading(false)
    if (!response.ok) {
      toast.add({
        title: label(config?.profileSectionLabel, 'Profile'),
        description: 'There was an error updating your profile. Please try again.',
        type: 'error',
      })
      return
    }
    const { doc } = await response.json()
    setUser(doc)
    toast.add({
      title: label(config?.profileSectionLabel, 'Profile'),
      description: label(config?.profileSuccessMessage, 'Profile updated.'),
      type: 'success',
    })
  })

  return (
    <div className="mb-8 rounded-lg border border-border bg-surface p-8">
      <h2 className="mb-6 text-xl font-medium text-primary">
        {label(config?.profileSectionLabel, 'Profile')}
      </h2>

      <form onSubmit={onSubmit}>
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
  const toast = useToast()
  const trackUpdatePassword = useTrackClick('Update password', 'Account Details Block')
  const [loading, setLoading] = useState(false)
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
    try {
      // Payload's update endpoint does not verify the old password, so re-authenticate first.
      // Failed attempts count toward the collection's login lockout.
      await login({ email: user.email, password: data.currentPassword })
    } catch (_error) {
      setLoading(false)
      toast.add({
        title: label(config?.passwordSectionLabel, 'Change password'),
        description: 'The current password is incorrect.',
        type: 'error',
      })
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
      toast.add({
        title: label(config?.passwordSectionLabel, 'Change password'),
        description: 'There was an error updating your password. Please try again.',
        type: 'error',
      })
      return
    }
    reset()
    toast.add({
      title: label(config?.passwordSectionLabel, 'Change password'),
      description: label(config?.passwordSuccessMessage, 'Password updated.'),
      type: 'success',
    })
  })

  return (
    <div className="rounded-lg border border-border bg-surface p-8">
      <h2 className="mb-6 text-xl font-medium text-primary">
        {label(config?.passwordSectionLabel, 'Change password')}
      </h2>

      <form onSubmit={onSubmit}>
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
