'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'

import type { LoginConfig } from '@/payload-types'

import { useAuth } from '@/providers/Auth'
import { useToast } from '@/providers/Toast'
import { useTrackClick } from '@/cms/hooks/useAnalytics'
import { getClientSideURL } from '@/cms/utilities/getURL'
import { TrackImpression } from '@/cms/components/Analytics/TrackImpression'
import { Button } from '@/website/components/elements/button'
import { Input } from '@/website/components/elements/input'
import { Label } from '@/website/components/elements/label'
import { Checkbox } from '@/website/components/elements/checkbox'
import { CMSLink } from '@/website/components/Link'
import { FormError } from '@/website/components/auth/FormError'
import { FormItem } from '@/website/components/auth/FormItem'

type View = 'login' | 'create' | 'forgot'

type Props = {
  config?: Partial<LoginConfig> | null
  title?: string
  accountPath?: string
}

const DEFAULT_POST_LOGIN_PATH = '/'

const label = (value: string | null | undefined, fallback: string) => value || fallback

// A plain text view-switch link that preserves other params and sets ?view=.
const ViewLink: React.FC<{
  view: View | null
  params: URLSearchParams
  children: string
  className?: string
}> = ({ view, params, children, className }) => {
  const next = new URLSearchParams(params)
  if (view && view !== 'login') next.set('view', view)
  else next.delete('view')
  const query = next.toString()
  return (
    <CMSLink
      type="custom"
      url={`?${query}`}
      appearance="inline"
      className={className}
      label={children}
    />
  )
}

export const UserLoginClient: React.FC<Props> = ({ config, title, accountPath }) => {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view')
  const view: View = viewParam === 'create' ? 'create' : viewParam === 'forgot' ? 'forgot' : 'login'

  if (user) {
    return <AccountPanel accountPath={accountPath} config={config} />
  }

  if (view === 'create') {
    return <CreateAccountView config={config} params={searchParams} />
  }

  if (view === 'forgot') {
    return <ForgotPasswordView config={config} params={searchParams} />
  }

  return <LoginView config={config} params={searchParams} title={title} />
}

const AccountPanel: React.FC<{
  accountPath?: string
  config?: Partial<LoginConfig> | null
}> = ({ accountPath, config }) => {
  const { logout } = useAuth()
  const toast = useToast()
  const trackViewAccount = useTrackClick('View account', 'User Login Block')

  const onLogout = async () => {
    try {
      await logout()
      toast.add({ description: 'You are now signed out.', type: 'success' })
    } catch (_error) {
      toast.add({ description: 'There was an error signing out. Please try again.', type: 'error' })
    }
  }

  return (
    <TrackImpression componentName="User Login Block" componentType="user-login" as="section">
      <div className="container my-16 max-w-lg">
        <div className="rounded-lg border border-border bg-surface p-8">
          <div className="flex flex-wrap gap-3">
            {accountPath && (
              <Button asChild variant="default">
                <a href={accountPath} onClick={() => trackViewAccount(accountPath)}>
                  {label(config?.accountTitle, 'Your account')}
                </a>
              </Button>
            )}
            <Button onClick={onLogout} variant="ghost">
              {label(config?.logoutLabel, 'Log out')}
            </Button>
          </div>
        </div>
      </div>
    </TrackImpression>
  )
}

const LoginView: React.FC<{
  config?: Partial<LoginConfig> | null
  params: URLSearchParams
  title?: string
}> = ({ config, params, title }) => {
  const { login } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const trackLogin = useTrackClick('Log in', 'User Login Block')
  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<{ email: string; password: string }>()

  const onSubmit = handleSubmit(async (data) => {
    trackLogin()
    try {
      await login(data)
      toast.add({ description: 'You are now signed in.', type: 'success' })
      router.push(params.get('redirect') || DEFAULT_POST_LOGIN_PATH)
    } catch (_error) {
      toast.add({ description: 'Invalid email or password. Please try again.', type: 'error' })
    }
  })

  return (
    <TrackImpression componentName="User Login Block" componentType="user-login" as="section">
      <div className="container my-16 max-w-lg">
        <h1 className="mb-6 text-3xl font-medium text-primary">
          {title ?? label(config?.title, 'Log in')}
        </h1>
        {config?.intro && <p className="mb-8 text-primary">{config.intro}</p>}

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-8">
            <FormItem>
              <Label htmlFor="email">{label(config?.emailLabel, 'Email')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required.' })}
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="password">{label(config?.passwordLabel, 'Password')}</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Please provide a password.' })}
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <Button
              className=" w-full"
              disabled={isLoading}
              size="lg"
              type="submit"
              variant="default"
            >
              {isLoading ? 'Processing' : label(config?.submitLabel, 'Continue')}
            </Button>

            <div className="flex flex-wrap justify-between gap-x-4 gap-y-2 text-primary/70">
              {(config?.showForgotPassword ?? true) && (
                <ViewLink view="forgot" params={params} className="underline hover:text-primary">
                  {label(config?.forgotPasswordLabel, 'Forgot your password?')}
                </ViewLink>
              )}
              {(config?.showCreateAccount ?? true) && (
                <ViewLink view="create" params={params} className="underline hover:text-primary">
                  {label(config?.createAccountLabel, 'Create an account')}
                </ViewLink>
              )}
            </div>
          </div>

          {config?.extraLinks && config.extraLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {config.extraLinks.map(({ link }, index) => (
                <CMSLink key={index} {...link} />
              ))}
            </div>
          )}
        </form>
      </div>
    </TrackImpression>
  )
}

const CreateAccountView: React.FC<{
  config?: Partial<LoginConfig> | null
  params: URLSearchParams
}> = ({ config, params }) => {
  const { login } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const trackCreateAccount = useTrackClick('Create account', 'User Login Block')
  const [loading, setLoading] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<{
    name: string
    email: string
    password: string
    passwordConfirm: string
    consent?: boolean
  }>()
  const passwordValue = watch('password', '')
  const requireConsent = Boolean(config?.requireConsent)

  const onSubmit = handleSubmit(async (data) => {
    trackCreateAccount()
    setLoading(true)
    const response = await fetch(`${getClientSideURL()}/api/users`, {
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        roles: ['customer'],
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    if (!response.ok) {
      setLoading(false)
      toast.add({ description: 'There was an error creating the account.', type: 'error' })
      return
    }
    try {
      await login({ email: data.email, password: data.password })
      toast.add({ description: 'Your account has been created.', type: 'success' })
      router.push(params.get('redirect') || DEFAULT_POST_LOGIN_PATH)
    } catch (_error) {
      setLoading(false)
      toast.add({
        description: 'Account created, but sign-in failed. Please log in.',
        type: 'error',
      })
    }
  })

  return (
    <TrackImpression componentName="User Login Block" componentType="user-login" as="section">
      <div className="container my-16 max-w-lg">
        <h1 className="mb-6 text-3xl font-medium text-primary">
          {label(config?.createTitle, 'Create an account')}
        </h1>
        {config?.createIntro && <p className="mb-8 text-primary">{config.createIntro}</p>}

        <form onSubmit={onSubmit}>
          <div className="mb-8 flex flex-col gap-8">
            <FormItem>
              <Label htmlFor="name">{label(config?.nameLabel, 'Name')}</Label>
              <Input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required.' })}
              />
              {errors.name && <FormError message={errors.name.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="email">{label(config?.emailLabel, 'Email')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required.' })}
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="password">{label(config?.passwordLabel, 'Password')}</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required.' })}
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="passwordConfirm">
                {label(config?.passwordConfirmLabel, 'Confirm password')}
              </Label>
              <Input
                id="passwordConfirm"
                type="password"
                {...register('passwordConfirm', {
                  required: 'Please confirm your password.',
                  validate: (value) => value === passwordValue || 'The passwords do not match.',
                })}
              />
              {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
            </FormItem>

            {requireConsent && (
              <FormItem>
                <div className="flex items-center gap-2">
                  <Checkbox id="consent" {...register('consent', { required: true })} />
                  <Label htmlFor="consent">
                    {label(config?.consentLabel, 'I agree to the')}{' '}
                    <a className="underline" href={config?.consentLink || '/privacy-policy'}>
                      {label(config?.consentLinkLabel, 'privacy policy')}
                    </a>
                  </Label>
                </div>
                {errors.consent && <FormError message="Please accept to continue." />}
              </FormItem>
            )}
          </div>

          <Button className="w-full" disabled={loading} size="lg" type="submit" variant="default">
            {loading ? 'Processing' : label(config?.createSubmitLabel, 'Create Account')}
          </Button>

          <p className="mt-6 text-end text-primary/70">
            <ViewLink view="login" params={params} className="underline hover:text-primary">
              {label(config?.title, 'Log in')}
            </ViewLink>
          </p>
        </form>
      </div>
    </TrackImpression>
  )
}

const ForgotPasswordView: React.FC<{
  config?: Partial<LoginConfig> | null
  params: URLSearchParams
}> = ({ config, params }) => {
  const toast = useToast()
  const trackResetPassword = useTrackClick('Reset password', 'User Login Block')
  const [success, setSuccess] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<{ email: string }>()

  const onSubmit = handleSubmit(async (data) => {
    trackResetPassword()
    const response = await fetch(`${getClientSideURL()}/api/users/forgot-password`, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    if (response.ok) {
      setSuccess(true)
    } else {
      toast.add({
        title: label(config?.forgotTitle, 'Forgot Password'),
        description: 'There was a problem sending the reset email. Please try again.',
        type: 'error',
      })
    }
  })

  if (success) {
    return (
      <TrackImpression componentName="User Login Block" componentType="user-login" as="section">
        <div className="container my-16 max-w-lg">
          <h1 className="mb-4 text-3xl font-medium text-primary">
            {label(config?.forgotSuccessTitle, 'Request submitted')}
          </h1>
          <p className="text-primary/70">
            {label(
              config?.forgotSuccessMessage,
              'Check your email for a link that will allow you to securely reset your password.',
            )}
          </p>
        </div>
      </TrackImpression>
    )
  }

  return (
    <TrackImpression componentName="User Login Block" componentType="user-login" as="section">
      <div className="container my-16 max-w-lg">
        <h1 className="mb-6 text-3xl font-medium text-primary">
          {label(config?.forgotTitle, 'Forgot Password')}
        </h1>
        <p className="mb-8 text-primary/70">
          {label(
            config?.forgotIntro,
            'Please enter your email below. You will receive an email with instructions on how to reset your password.',
          )}
        </p>

        <form onSubmit={onSubmit}>
          <FormItem className="mb-8">
            <Label htmlFor="email">{label(config?.emailLabel, 'Email')}</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Please provide your email.' })}
            />
            {errors.email && <FormError message={errors.email.message} />}
          </FormItem>

          <Button className="w-full" size="lg" type="submit" variant="default">
            {label(config?.forgotSubmitLabel, 'Reset Password')}
          </Button>
          <p className="mt-6 text-end text-primary/70">
            <ViewLink view="login" params={params} className="underline hover:text-primary">
              {label(config?.title, 'Log in')}
            </ViewLink>
          </p>
        </form>
      </div>
    </TrackImpression>
  )
}
