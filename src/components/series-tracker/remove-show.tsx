import { useState } from 'react'
import { ConfirmModal } from '@/components/series-tracker/confirm-modal'

export const RemoveShow = ({
  showId,
  onRemove,
}: {
  showId: string
  onRemove: (removedId: string) => void
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null)

  const requestRemove = (imdbId: string) => {
    setPendingRemoveId(imdbId)
    setConfirmOpen(true)
  }

  const confirmRemove = () => {
    if (pendingRemoveId) {
      onRemove(pendingRemoveId)
    }
    setConfirmOpen(false)
    setPendingRemoveId(null)
  }

  return (
    <>
      <button
        className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
        onClick={() => requestRemove(showId)}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Remove show
      </button>

      <ConfirmModal
        open={confirmOpen}
        title="Remove show?"
        description="This will remove the show from your list on this device. You can add it again later."
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={() => {
          setConfirmOpen(false)
          setPendingRemoveId(null)
        }}
      />
    </>
  )
}
