import { ReactNode } from "react"
import { cn } from "utils/cn"

type FieldErrorMessageProps = {
  id: string
  children: ReactNode
  className?: string
}

export const FieldErrorMessage = ({ id, children, className }: FieldErrorMessageProps) => (
  <p id={id} className={cn("text-sm text-negative", className)}>
    {children}
  </p>
)
