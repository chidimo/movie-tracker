import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { HTMLAttributes } from 'react'

export const mergeClasses = (
  ...inputs: Array<HTMLAttributes<HTMLElement>['className']>
) => {
  return twMerge(clsx(...inputs))
}
