import { useEffect, useState } from 'react'
import { StorageRepo } from '@/lib/storage'
import { ProfileForm } from '@/components/profile-form'
import { DialogShell } from '@/components/ui/dialog'

export const ProfileModal = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const s = StorageRepo.getState()
    if (!s.profile) setOpen(true)
  }, [])

  return (
    <DialogShell
      open={open}
      onClose={() => {}}
      title="Create your profile"
    >
      <ProfileForm onSave={() => setOpen(false)} />
    </DialogShell>
  )
}
