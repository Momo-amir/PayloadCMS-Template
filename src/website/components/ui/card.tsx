import { cn } from '@/cms/utilities/ui'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const cardVariants = cva('rounded-lg border shadow-sm', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: 'bg-card',
      light: 'bg-base',
      dark: 'bg-accent',
      primary: 'bg-primary border-primary',
      secondary: 'bg-secondary border-secondary',
    },
  },
})

export type CardVariant = VariantProps<typeof cardVariants>['variant']

const Card: React.FC<
  { ref?: React.Ref<HTMLDivElement> } &
    React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof cardVariants>
> = ({ className, ref, variant, ...props }) => (
  <div className={cn(cardVariants({ className, variant }))} ref={ref} {...props} />
)

const CardHeader: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} ref={ref} {...props} />
)

const CardTitle: React.FC<
  { ref?: React.Ref<HTMLHeadingElement> } & React.HTMLAttributes<HTMLHeadingElement>
> = ({ className, ref, ...props }) => (
  <h3
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    ref={ref}
    {...props}
  />
)

const CardDescription: React.FC<
  { ref?: React.Ref<HTMLParagraphElement> } & React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ref, ...props }) => (
  <p className={cn('text-sm ', className)} ref={ref} {...props} />
)

const CardContent: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
  <div className={cn('p-6 pt-0', className)} ref={ref} {...props} />
)

const CardFooter: React.FC<
  { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ref, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} ref={ref} {...props} />
)

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants }
