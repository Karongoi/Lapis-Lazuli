'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function TanstackProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        refetchOnMount: false
      }
    }
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
