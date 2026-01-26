import { useState } from 'react'
import type { UserProfile } from '@movie-tracker/core'
import { useSeriesTracker } from '@/context/series-tracker-context'

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
    alert('Profile saved!')
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
      <p className="text-sm text-gray-700 mb-4">
        Update your display name. This stays on your browser only.
      </p>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
        placeholder="Your name"
        className="w-full border rounded px-3 py-2 mb-4"
      />
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white"
        onClick={handleSave}
      >
        Save Profile
      </button>
    </div>
  )
}
