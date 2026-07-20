'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { IconUserCircle } from '@tabler/icons-react'

import { useAuth } from '@/providers/Auth'
import { useToast } from '@/providers/Toast'
import { Button } from '@/website/components/elements/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/website/components/elements/popover'

type AccountLinkProps = {
  loginPath: string
  accountPath?: string
}

export const AccountLink: React.FC<AccountLinkProps> = ({ loginPath, accountPath }) => {
  const { user, logout } = useAuth()
  const toast = useToast()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPath = React.useMemo(() => {
    const query = searchParams?.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  const loginHref = React.useMemo(() => {
    const next = new URLSearchParams()

    if (currentPath && currentPath !== loginPath) {
      next.set('redirect', currentPath)
    }

    const query = next.toString()
    return query ? `${loginPath}?${query}` : loginPath
  }, [currentPath, loginPath])

  if (!user) {
    return (
      <Button asChild variant="link">
        <Link href={loginHref}>Sign in</Link>
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="clear" variant="ghost" aria-label="Your account">
          <IconUserCircle stroke={2} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="min-w-48" role="menu">
        <div className="flex flex-col gap-1">
          <p className="truncate px-2 py-1 text-sm text-primary/60">{user.name || user.email}</p>
          {accountPath && accountPath !== loginPath && (
            <Link
              className="rounded px-2 py-1 hover:bg-accent/10"
              href={accountPath}
              role="menuitem"
            >
              Your account
            </Link>
          )}
          <button
            className="rounded px-2 py-1 text-left hover:bg-accent/10"
            onClick={async () => {
              try {
                await logout()
                toast.add({ description: 'You are now signed out.', type: 'success' })
                router.push(loginPath)
              } catch (_error) {
                toast.add({
                  description: 'There was an error signing out. Please try again.',
                  type: 'error',
                })
              }
            }}
            role="menuitem"
            type="button"
          >
            Log out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
