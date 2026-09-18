import { ComponentPropsWithRef, ReactNode } from "react"

export type ModalProps = {
  isOpen: boolean
  onClose: VoidFunction
  children: ReactNode
  closeLabel?: string
  className?: string
  testId?: string
}

export type ModalHeaderProps = ComponentPropsWithRef<"h2"> & {
  header: ReactNode
}

export type ModalSectionProps = {
  children: ReactNode
  className?: string
}
