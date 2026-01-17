import { createFileRoute } from '@tanstack/react-router'
import { SeriesDetailPage } from '@/components/series-detail/series-detail-page'

export const Route = createFileRoute('/$imdbId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SeriesDetailPage />
}
