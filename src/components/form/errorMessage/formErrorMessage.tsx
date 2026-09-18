import { GlobalError } from "react-hook-form"
import { cn } from "utils/cn"

type FormErrorMessageProps = {
  error?: GlobalError
  className?: string
}

export const FormErrorMessage = ({ error, className }: FormErrorMessageProps) => {
  if (!error?.message) return null

  return (
    <div role="alert" className={cn("rounded-lg bg-negative-light px-4 py-3 text-sm text-negative", className)}>
      {error.message}
    </div>
  )
}
