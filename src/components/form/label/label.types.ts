import { ComponentPropsWithoutRef, ReactNode } from "react"

export type LabelProps = Omit<ComponentPropsWithoutRef<"label">, "children"> & {
  children: ReactNode
  isRequired?: boolean
  isDisabled?: boolean
}
