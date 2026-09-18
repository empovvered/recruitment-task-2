import { QueryClient, QueryClientConfig } from "@tanstack/react-query"

export const createQueryClient = (config?: QueryClientConfig) =>
  new QueryClient({
    ...config,
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  })
