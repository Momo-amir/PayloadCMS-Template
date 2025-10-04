import { cn } from '@/cms/utilities/ui'
import * as React from 'react'

// Primitive Card component without variant logic.
// Variant styling is owned by higher-level components (e.g., CustomCard).
const Card: React.FC<{ ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ref,
  ...props
}) => <div className={cn('rounded-lg border shadow-sm', className)} ref={ref} {...props} />

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

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
