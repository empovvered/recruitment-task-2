import { ComponentPropsWithRef, ReactNode } from "react"

export type SelectOption = {
  value: string
  label: ReactNode
}

export type SelectProps = Omit<ComponentPropsWithRef<"select">, "disabled" | "required" | "children"> & {
  label: ReactNode
  options: SelectOption[]
  testId: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isRequired?: boolean
}
