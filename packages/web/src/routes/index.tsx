import { createFileRoute } from '@tanstack/react-router'
import { SeriesTrackerPage } from '@/components/series-tracker/series-tracker-page'
export const Route = createFileRoute('/')({ component: App })

function App() {
  return <SeriesTrackerPage />
}
