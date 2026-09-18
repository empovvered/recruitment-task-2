import { ComponentPropsWithRef, ReactNode } from "react"

export type CheckboxProps = Omit<ComponentPropsWithRef<"input">, "type" | "disabled" | "required" | "defaultValue"> & {
  label: ReactNode
  testId: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isRequired?: boolean
}
