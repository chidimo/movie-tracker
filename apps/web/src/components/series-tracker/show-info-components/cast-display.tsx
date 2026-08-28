import type { Show } from '@movie-tracker/core'
import { Badge } from '@/components/ui/badge'

export const CastDisplay = ({ cast }: { cast: Show['mainCast'] }) => {
  if (!cast || cast.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1">
      {cast.slice(0, 4).map((c) => (
        <Badge key={c} variant="secondary">
          {c}
        </Badge>
      ))}
    </div>
  )
}
