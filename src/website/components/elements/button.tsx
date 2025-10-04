import { cn } from '@/cms/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded px-8',
        sm: 'h-9 rounded px-3',
        iconXL: 'h-16 w-16',
      },
      variant: {
        default: 'bg-primary border border-primary text-base hover:bg-base hover:text-primary',
        accent: 'bg-accent text-primary hover:bg-accentthree hover:text-primary',
        ghost: 'hover:bg-border hover:text-accent',
        link: 'text-primary items-start justify-start relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full max-w-fit',
        outline: 'border border-primary bg-base hover:bg-primary hover:text-base',
        secondary: 'bg-secondary text-base hover:bg-secondary/80',
        tertiary: 'bg-tertiary text-accent2 hover:bg-accent2 hover:text-tertiary',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props} />
}

export { Button, buttonVariants }
