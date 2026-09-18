import { ComponentPropsWithRef, ReactNode } from "react"

export type ButtonVariant = "primary" | "secondary"

export type ButtonProps = Omit<ComponentPropsWithRef<"button">, "disabled" | "children"> & {
  children: ReactNode
  testId: string
  variant?: ButtonVariant
  isLoading?: boolean
  isDisabled?: boolean
}
