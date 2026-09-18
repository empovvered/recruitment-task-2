import { ComponentPropsWithRef, ReactNode } from "react"

export type InputProps = Omit<ComponentPropsWithRef<"input">, "disabled" | "required"> & {
  label: ReactNode
  testId: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isRequired?: boolean
}
