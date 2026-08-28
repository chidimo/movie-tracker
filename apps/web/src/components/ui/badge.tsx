import type { HTMLAttributes } from 'react'
import { mergeClasses as cn } from '@/lib/class-merge'

export type BadgeVariant = 'default' | 'secondary' | 'outline'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-border text-muted-foreground',
}

export const Badge = ({
  className,
  variant = 'secondary',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      variants[variant],
      className,
    )}
    {...props}
  />
)
