import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import type { ReactNode } from 'react'
import { mergeClasses as cn } from '@/lib/class-merge'

type Props = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  className?: string
}

/** Themed modal shell shared by the app's dialogs. */
export const DialogShell = ({
  open,
  onClose,
  title,
  children,
  className,
}: Props) => (
  <Dialog open={open} onClose={onClose} className="relative z-50">
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      aria-hidden="true"
    />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel
        className={cn(
          'w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl',
          className,
        )}
      >
        {title ? (
          <DialogTitle className="text-base font-semibold">
            {title}
          </DialogTitle>
        ) : null}
        {children}
      </DialogPanel>
    </div>
  </Dialog>
)
