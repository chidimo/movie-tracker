import { useState } from 'react'
import type { UserProfile } from '@movie-tracker/core'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { Button } from '@/components/ui/button'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-')
}

interface ProfileFormProps {
  onSave?: (profile: UserProfile) => void
  className?: string
}

export const ProfileForm = ({ onSave, className = '' }: ProfileFormProps) => {
  const { state, setProfile } = useSeriesTracker()
  const [name, setName] = useState(state.profile?.name || '')

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const profile: UserProfile = {
      name: trimmed,
      slug: slugify(trimmed),
      registeredAt: state.profile?.registeredAt || new Date().toISOString(),
    }
    setProfile(profile)
    onSave?.(profile)
  }

  return (
    <div className={className}>
      <p className="mt-2 text-sm text-muted-foreground">
        Your display name. Stored on this browser only.
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        className="mt-4 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="mt-5 flex justify-end">
        <Button onClick={handleSave} disabled={!name.trim()}>
          Save profile
        </Button>
      </div>
    </div>
  )
}
