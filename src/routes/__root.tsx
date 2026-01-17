import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import WorkOSProvider from '../integrations/workos/provider'
import { Header } from '@/components/header-component'
import { SeriesTrackerProvider } from '@/components/series-tracker/series-tracker-context'

export const Route = createRootRoute({
  component: () => (
    <WorkOSProvider>
      <SeriesTrackerProvider>
        <Header />
        <main className="px-4 md:px-20 py-10 overflow-auto">
          <Outlet />
        </main>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </SeriesTrackerProvider>
    </WorkOSProvider>
  ),
})
