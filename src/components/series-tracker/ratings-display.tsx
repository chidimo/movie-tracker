import { formatNumber } from "@/lib/utils"

export const RatingsDisplay = ({
  rating,
  votes,
}: {
  rating?: number
  votes?: number
}) => {
  if (!rating) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <p className="font-semibold">{rating}</p>
      {votes ? <p className="text-gray-600">/ {formatNumber(votes)} votes</p> : null}
    </div>
  )
}
