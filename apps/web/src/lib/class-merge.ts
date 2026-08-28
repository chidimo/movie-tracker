import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export const mergeClasses = (...inputs: Array<ClassValue>) => {
  return twMerge(clsx(inputs))
}
