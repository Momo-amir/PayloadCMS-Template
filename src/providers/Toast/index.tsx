'use client'

import React from 'react'
import { Toast } from '@base-ui/react/toast'
import { cva } from 'class-variance-authority'
import { CheckCircle2, X, XCircle } from 'lucide-react'

import { cn } from '@/cms/utilities/ui'

export const ToastProvider = Toast.Provider
export const useToast = Toast.useToastManager

const toastVariants = cva(
  'pointer-events-auto flex w-80 items-start gap-3 rounded-xl border bg-surface p-4 shadow-lg',
  {
    variants: {
      type: {
        success: 'bg-success/90',
        error: 'bg-error/90',
        default: 'bg-accent/90',
      },
    },
    defaultVariants: {
      type: 'default',
    },
  },
)

const ToastIcon: React.FC<{ type?: string }> = ({ type }) => {
  if (type === 'success') return <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-white" />
  if (type === 'error') return <XCircle size={20} className="mt-0.5 shrink-0 text-white" />
  return null
}

export const Toaster: React.FC = () => {
  const { toasts } = useToast()

  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-3">
        {toasts.map((toast) => {
          const type = toast.type as 'success' | 'error' | 'default' | undefined
          return (
            <Toast.Root key={toast.id} toast={toast} className={cn(toastVariants({ type }))}>
              <ToastIcon type={toast.type} />
              <div className="flex flex-1 flex-col gap-0.5">
                <Toast.Title className="text-h4 leading-h4 font-h4 text-white" />
                <Toast.Description className="text-helper text-white" />
              </div>
              <Toast.Close
                aria-label="Close"
                className="shrink-0 cursor-pointer text-white transition-colors hover:text-white/90"
              >
                <X size={16} />
              </Toast.Close>
            </Toast.Root>
          )
        })}
      </Toast.Viewport>
    </Toast.Portal>
  )
}
