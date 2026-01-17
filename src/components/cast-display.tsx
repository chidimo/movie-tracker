import type { Show } from '@/lib/series-tracker/types'

export const CastDisplay = ({ cast }: { cast: Show['mainCast'] }) => {
  if (!cast) return null
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {cast.slice(0, 5).map((c) => (
        <span
          key={c}
          className="text-[10px] md:text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full"
        >
          {c}
        </span>
      ))}
    </div>
  )
}
