import { QueryClientProvider } from "@tanstack/react-query"
import { createQueryClient } from "api/queryClient"
import { ReactNode } from "react"

export type WrapperProps = {
  children: ReactNode
}

export const Wrapper = ({ children }: WrapperProps) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
)
