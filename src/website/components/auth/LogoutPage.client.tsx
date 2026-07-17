'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/providers/Auth'

type LogoutPageProps = {
  loginPath: string
}

const SUCCESS_MESSAGE = 'You are now logged out.'
const WARNING_MESSAGE = 'You were already logged out.'

export const LogoutPage: React.FC<LogoutPageProps> = ({ loginPath }) => {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      const query = new URLSearchParams()

      try {
        await logout()
        query.set('success', SUCCESS_MESSAGE)
      } catch {
        query.set('warning', WARNING_MESSAGE)
      }

      router.replace(`${loginPath}?${query.toString()}`)
    }

    void performLogout()
  }, [loginPath, logout, router])

  return (
    <div className="text-primary">
      <h1 className="mb-4 text-2xl font-medium">Logging you out...</h1>
      <p>Please wait while we end your session.</p>
    </div>
  )
}
