'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/cms/utilities/ui'

type PopoverContextValue = {
  contentId: string
  open: boolean
  setOpen: (nextOpen: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

const usePopoverContext = () => {
  const context = React.useContext(PopoverContext)

  if (!context) {
    throw new Error('Popover components must be used within Popover.')
  }

  return context
}

type PopoverProps = {
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  className,
  defaultOpen = false,
  onOpenChange,
  open: controlledOpen,
}) => {
  const contentId = React.useId()
  const triggerRef = React.useRef<HTMLElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

  const open = controlledOpen ?? uncontrolledOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [controlledOpen, onOpenChange],
  )

  return (
    <PopoverContext.Provider value={{ contentId, open, setOpen, triggerRef }}>
      <div className={cn('relative inline-flex', className)}>{children}</div>
    </PopoverContext.Provider>
  )
}

type PopoverTriggerProps = {
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild = false, onClick, ...props }, forwardedRef) => {
    const { contentId, open, setOpen, triggerRef } = usePopoverContext()
    const Component = asChild ? Slot : 'button'

    return (
      <Component
        {...props}
        aria-controls={contentId}
        aria-expanded={open}
        aria-haspopup="menu"
        data-state={open ? 'open' : 'closed'}
        onClick={(clickEvent: React.MouseEvent<HTMLButtonElement>) => {
          setOpen(!open)
          onClick?.(clickEvent)
        }}
        ref={(node: HTMLButtonElement | null) => {
          triggerRef.current = node

          if (typeof forwardedRef === 'function') {
            forwardedRef(node)
          } else if (forwardedRef) {
            forwardedRef.current = node
          }
        }}
        type={props.type || 'button'}
      />
    )
  },
)

PopoverTrigger.displayName = 'PopoverTrigger'

type PopoverContentProps = {
  align?: 'center' | 'end' | 'start'
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const alignClassName: Record<NonNullable<PopoverContentProps['align']>, string> = {
  start: 'left-0 origin-top-left',
  center: 'left-1/2 -translate-x-1/2 origin-top',
  end: 'right-0 origin-top-right',
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ align = 'end', children, className, onKeyDown, ...props }, forwardedRef) => {
    const { contentId, open, setOpen, triggerRef } = usePopoverContext()
    const contentRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
      if (!open) {
        return
      }

      const handlePointerDown = (pointerEvent: MouseEvent | PointerEvent | TouchEvent) => {
        const target = pointerEvent.target as Node

        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false)
        }
      }

      const handleEscape = (keyboardEvent: KeyboardEvent) => {
        if (keyboardEvent.key === 'Escape') {
          setOpen(false)
          triggerRef.current?.focus()
        }
      }

      document.addEventListener('mousedown', handlePointerDown)
      document.addEventListener('touchstart', handlePointerDown)
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('mousedown', handlePointerDown)
        document.removeEventListener('touchstart', handlePointerDown)
        document.removeEventListener('keydown', handleEscape)
      }
    }, [open, setOpen, triggerRef])

    return (
      <div
        {...props}
        aria-hidden={!open}
        className={cn(
          'absolute top-full z-30 mt-2 min-w-44 rounded-xl bg-base px-2 py-2 shadow-md transition-all duration-200',
          alignClassName[align],
          open
            ? 'pointer-events-auto scale-y-100 opacity-100'
            : 'pointer-events-none scale-y-0 opacity-0',
          className,
        )}
        data-state={open ? 'open' : 'closed'}
        id={contentId}
        onKeyDown={(keyboardEvent) => {
          if (keyboardEvent.key === 'Escape') {
            setOpen(false)
            triggerRef.current?.focus()
            return
          }

          onKeyDown?.(keyboardEvent)
        }}
        ref={(node) => {
          contentRef.current = node

          if (typeof forwardedRef === 'function') {
            forwardedRef(node)
          } else if (forwardedRef) {
            forwardedRef.current = node
          }
        }}
        role="menu"
      >
        {children}
      </div>
    )
  },
)

PopoverContent.displayName = 'PopoverContent'
