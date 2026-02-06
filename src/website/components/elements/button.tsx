import { cn } from '@/cms/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

export type IconAlignment = 'left' | 'right'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-body font-body-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2 w-full sm:w-fit',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded px-8 w-full sm:w-fit',
        sm: 'h-9 rounded px-3',
      },
      variant: {
        default: 'bg-primary border border-primary text-base hover:bg-base hover:text-primary',
        accent: 'bg-accent text-primary hover:bg-accentthree hover:text-primary',
        ghost: 'hover:bg-border hover:text-accent',
        link: 'text-primary items-start justify-start relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:cursor-pointer max-w-min @max-md:active:text-accentthree transition-colors duration-200 ',
        outline: 'border border-primary bg-transparent hover:bg-primary hover:text-base',
        secondary: 'bg-black text-white hover:bg-secondary active:bg-secondary',
        tertiary: 'bg-white text-black hover:bg-accentthree active:bg-accentthree',
        circle:
          'cursor-pointer w-12 h-12 rounded-full bg-primary text-base shadow disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-base transition-colors duration-200 ease-in-out hover:bg-accent hover:text-white',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
  icon?: React.ComponentType<{ size?: number; className?: string }>
  iconSize?: number
  iconAlignment?: IconAlignment
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  ref,
  icon: IconComponent,
  iconSize = 24,
  iconAlignment = 'left',
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props}>
      <span className="flex items-center">
        {IconComponent && iconAlignment == 'left' && (
          <IconComponent size={iconSize} className={children ? 'mr-2' : ''} />
        )}
        {children}
        {IconComponent && iconAlignment == 'right' && (
          <IconComponent size={iconSize} className={children ? 'ml-2' : ''} />
        )}
      </span>
    </Comp>
  )
}

export { Button, buttonVariants }
