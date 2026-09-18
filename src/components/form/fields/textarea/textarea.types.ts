import { ComponentPropsWithRef, ReactNode } from "react"

export type TextareaProps = Omit<ComponentPropsWithRef<"textarea">, "disabled" | "required" | "maxLength"> & {
  label: ReactNode
  testId: string
  errorMessage?: string
  characterLimit?: number
  isInvalid?: boolean
  isDisabled?: boolean
  isRequired?: boolean
}
