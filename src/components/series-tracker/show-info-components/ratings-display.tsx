import { Rating } from 'react-simple-star-rating'
import { formatNumber } from '@/lib/utils'

export const RatingsDisplay = ({
  rating,
  votes,
}: {
  rating?: number
  votes?: number
}) => {
  if (!rating) return null
  const stars = Math.max(0, Math.min(5, rating / 2))

  return (
    <div className="flex-1 flex items-center gap-2 w-full text-xs">
      <div className="flex items-center">
        <Rating
          initialValue={stars}
          readonly
          allowFraction
          size={16}
          // fillColor="var(--progress-color)"
          className="flex flex-row"
          SVGstyle={{ display: 'inline-block' }}
        />
      </div>
      <p className="font-semibold">{rating}</p>
      {votes ? (
        <p className="text-gray-600">/ {formatNumber(votes)} votes</p>
      ) : null}
    </div>
  )
}
