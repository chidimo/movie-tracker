import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { StorageRepo } from '@/lib/storage'
import { ProfileForm } from '@/components/profile-form'

export const ProfileModal = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const s = StorageRepo.getState()
    if (!s.profile) setOpen(true)
  }, [])

  const handleSave = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-md rounded bg-white p-6">
          <DialogTitle className="text-lg font-semibold mb-2">
            Create your profile
          </DialogTitle>
          <ProfileForm onSave={handleSave} />
        </DialogPanel>
      </div>
    </Dialog>
  )
}
