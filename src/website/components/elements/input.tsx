import { cn } from '@/cms/utilities/ui'
import * as React from 'react'

const Input: React.FC<
  {
    ref?: React.Ref<HTMLInputElement>
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ type, className, ref, ...props }) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded border border-border bg-surface px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-border focus-visible:outline-none  focus-visible:border-primary   disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200',
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  )
}

export { Input }
