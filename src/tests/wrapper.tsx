import { ReactNode } from "react"

export type WrapperProps = {
  children: ReactNode
}

export const Wrapper = ({ children }: WrapperProps) => <>{children}</>
