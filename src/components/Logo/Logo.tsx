import clsx from 'clsx'
import React from 'react'
import logoWhite from 'src/assets/kollab-logo-white.svg'
import logo from 'src/assets/kollab-logo-darkblue.svg'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <div>
      <img
        alt="Kollab Logo"
        width={193}
        height={34}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('max-w-[9.375rem] w-full dark:hidden h-[34px]', className)}
        src={logo.src}
      />

      <img
        src={logoWhite.src}
        alt=""
        width={193}
        height={34}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('max-w-[9.375rem] w-full hidden dark:block h-[34px]', className)}
      />
    </div>
  )
}
