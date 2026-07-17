'use client'

import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'

import type { LoginConfig } from '@/payload-types'

import { useAuth } from '@/providers/Auth'
import { getClientSideURL } from '@/cms/utilities/getURL'
import { Button } from '@/website/components/elements/button'
import { Input } from '@/website/components/elements/input'
import { Label } from '@/website/components/elements/label'
import { Checkbox } from '@/website/components/elements/checkbox'
import { CMSLink } from '@/website/components/Link'
import { FormError } from '@/website/components/auth/FormError'
import { FormItem } from '@/website/components/auth/FormItem'
import { Message } from '@/website/components/auth/Message'

type View = 'login' | 'create' | 'forgot'

type Props = {
  config?: Partial<LoginConfig> | null
  title?: string
  basePath?: string
}

type QueryFeedback = {
  error?: string
  message?: string
  success?: string
  warning?: string
}

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

export const UserLoginClient: React.FC<Props> = ({ config, title }) => {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view')
  const view: View = viewParam === 'create' ? 'create' : viewParam === 'forgot' ? 'forgot' : 'login'

  const queryFeedback: QueryFeedback = {
    error: searchParams.get('error') || undefined,
    message: searchParams.get('message') || undefined,
    success: searchParams.get('success') || undefined,
    warning: searchParams.get('warning') || undefined,
  }

  if (user) {
    return <AccountPanel config={config} queryFeedback={queryFeedback} />
  }

  if (view === 'create') {
    return <CreateAccountView config={config} params={searchParams} queryFeedback={queryFeedback} />
  }

  if (view === 'forgot') {
    return (
      <ForgotPasswordView config={config} params={searchParams} queryFeedback={queryFeedback} />
    )
  }

  return (
    <LoginView config={config} params={searchParams} queryFeedback={queryFeedback} title={title} />
  )
}

const AccountPanel: React.FC<{
  config?: Partial<LoginConfig> | null
  queryFeedback?: QueryFeedback
}> = ({ config, queryFeedback }) => {
  const { user, logout } = useAuth()
  return (
    <section className="container my-16 max-w-lg">
      <div className="rounded-lg border border-border bg-surface p-8">
        <Message {...queryFeedback} className="mb-6" />
        <p className="mb-6 text-primary">
          Signed in as <span className="font-medium">{user?.name || user?.email}</span>.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="default">
            <a href="/account">Your account</a>
          </Button>
          <Button onClick={() => logout()} variant="ghost">
            {label(config?.logoutLabel, 'Log out')}
          </Button>
        </div>
      </div>
    </section>
  )
}

const LoginView: React.FC<{
  config?: Partial<LoginConfig> | null
  params: URLSearchParams
  queryFeedback?: QueryFeedback
  title?: string
}> = ({ config, params, queryFeedback, title }) => {
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<null | string>(null)
  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<{ email: string; password: string }>()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data)
      router.push(params.get('redirect') || '/account')
    } catch (_error) {
      setError('There was an error with the credentials provided. Please try again.')
    }
  })

  return (
    <section className="container my-16 max-w-lg">
      <h1 className="mb-6 text-3xl font-medium text-primary">
        {title ?? label(config?.title, 'Log in')}
      </h1>
      {config?.intro && <p className="mb-8 text-primary">{config.intro}</p>}

      <form onSubmit={onSubmit}>
        <Message {...queryFeedback} error={error || queryFeedback?.error} />
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
    </section>
  )
}

const CreateAccountView: React.FC<{
  config?: Partial<LoginConfig> | null
  params: URLSearchParams
  queryFeedback?: QueryFeedback
}> = ({ config, params, queryFeedback }) => {
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
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
      setError('There was an error creating the account.')
      return
    }
    try {
      await login({ email: data.email, password: data.password })
      router.push(params.get('redirect') || '/account')
    } catch (_error) {
      setLoading(false)
      setError('Account created, but sign-in failed. Please log in.')
    }
  })

  return (
    <section className="container my-16 max-w-lg">
      <h1 className="mb-6 text-3xl font-medium text-primary">
        {label(config?.createTitle, 'Create an account')}
      </h1>
      {config?.createIntro && <p className="mb-8 text-primary">{config.createIntro}</p>}

      <form onSubmit={onSubmit}>
        <Message {...queryFeedback} error={error || queryFeedback?.error} />
        <div className="mb-8 flex flex-col gap-8">
          <FormItem>
            <Label htmlFor="name">{label(config?.nameLabel, 'Name')}</Label>
            <Input id="name" type="text" {...register('name', { required: 'Name is required.' })} />
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
    </section>
  )
}

const ForgotPasswordView: React.FC<{
  config?: Partial<LoginConfig> | null
  params: URLSearchParams
  queryFeedback?: QueryFeedback
}> = ({ config, params, queryFeedback }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<{ email: string }>()

  const onSubmit = handleSubmit(async (data) => {
    const response = await fetch(`${getClientSideURL()}/api/users/forgot-password`, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError('There was a problem sending the reset email. Please try again.')
    }
  })

  if (success) {
    return (
      <section className="container my-16 max-w-lg">
        <h1 className="mb-4 text-3xl font-medium text-primary">
          {label(config?.forgotSuccessTitle, 'Request submitted')}
        </h1>
        <p className="text-primary/70">
          {label(
            config?.forgotSuccessMessage,
            'Check your email for a link that will allow you to securely reset your password.',
          )}
        </p>
      </section>
    )
  }

  return (
    <section className="container my-16 max-w-lg">
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
        <Message {...queryFeedback} className="mb-8" error={error || queryFeedback?.error} />
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
    </section>
  )
}
