"use client"

import { QueryClient, QueryClientProvider as BaseQueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "api/queryClient"
import { ReactNode } from "react"

let clientQueryClientSingleton: Optional<QueryClient> = undefined

const getQueryClient = () => {
  if (typeof window === "undefined") return createQueryClient()

  return (clientQueryClientSingleton ??= createQueryClient())
}

export const QueryClientProvider = ({ children }: { children: ReactNode }) => (
  <BaseQueryClientProvider client={getQueryClient()}>{children}</BaseQueryClientProvider>
)
