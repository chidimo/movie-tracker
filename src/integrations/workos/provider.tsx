import { AuthKitProvider } from '@workos-inc/authkit-react'
import { useNavigate } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const VITE_WORKOS_CLIENT_ID = import.meta.env.VITE_WORKOS_CLIENT_ID
if (!VITE_WORKOS_CLIENT_ID) {
  // throw new Error('Add your WorkOS Client ID to the .env.local file')
}

const VITE_WORKOS_API_HOSTNAME = import.meta.env.VITE_WORKOS_API_HOSTNAME
if (!VITE_WORKOS_API_HOSTNAME) {
  // throw new Error('Add your WorkOS API Hostname to the .env.local file')
}

const queryClient = new QueryClient()

export default function AppWorkOSProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const navigate = useNavigate()

  return (
    <AuthKitProvider
      clientId={VITE_WORKOS_CLIENT_ID}
      apiHostname={VITE_WORKOS_API_HOSTNAME}
      onRedirectCallback={({ state }) => {
        if (state?.returnTo) {
          navigate(state.returnTo)
        }
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthKitProvider>
  )
}
