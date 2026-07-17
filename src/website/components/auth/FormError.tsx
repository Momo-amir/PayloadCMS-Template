import { cn } from '@/cms/utilities/ui'

type Props = {
  message?: string
  as?: 'p' | 'span'
  className?: string
}

export const FormError: React.FC<Props> = ({ message, as, className }) => {
  const Element = as || 'p'

  if (!message) {
    return null
  }

  return <Element className={cn('text-error text-sm', className)}>{message}</Element>
}
