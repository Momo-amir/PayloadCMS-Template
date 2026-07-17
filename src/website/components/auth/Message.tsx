import { cn } from '@/cms/utilities/ui'
import React from 'react'

export const Message: React.FC<{
  className?: string
  error?: React.ReactNode
  message?: React.ReactNode
  success?: React.ReactNode
  warning?: React.ReactNode
}> = ({ className, error, message, success, warning }) => {
  const messageToRender = message || error || success || warning

  if (!messageToRender) {
    return null
  }

  return (
    <div
      className={cn(
        'p-4 my-8 rounded-lg',
        {
          'bg-success text-base': Boolean(success),
          'bg-accentthree text-primary': Boolean(warning),
          'bg-error text-base': Boolean(error),
          'bg-surface border border-border text-primary': Boolean(message),
        },
        className,
      )}
    >
      {messageToRender}
    </div>
  )
}
