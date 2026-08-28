import { StarIcon } from '@heroicons/react/24/solid'
import { formatNumber } from '@movie-tracker/core'

export const RatingsDisplay = ({
  rating,
  votes,
}: {
  rating?: number
  votes?: number
}) => {
  if (!rating) return null

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <StarIcon className="h-4 w-4 text-amber-500" />
      <span className="font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
      {votes ? (
        <span className="text-muted-foreground">
          ({formatNumber(votes)})
        </span>
      ) : null}
    </div>
  )
}
