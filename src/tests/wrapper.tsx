import { ReactNode } from "react"

export type WrapperProps = {
  children: ReactNode
}

//INFO: Every provider the app wraps its tree in belongs here, so a component under test sees what it sees in the app
export const Wrapper = ({ children }: WrapperProps) => <>{children}</>
