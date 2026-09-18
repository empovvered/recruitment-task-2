import { ReactNode } from "react"

export type ModalProps = {
  isOpen: boolean
  onClose: VoidFunction
  children: ReactNode
  closeLabel?: string
  className?: string
  testId?: string
}

export type ModalHeaderProps = {
  header: ReactNode
  className?: string
}

export type ModalSectionProps = {
  children: ReactNode
  className?: string
}
