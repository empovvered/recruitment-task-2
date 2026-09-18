import { cn } from "utils/cn"

import { LabelProps } from "./label.types"

export const Label = ({ children, className, isRequired, isDisabled, ...props }: LabelProps) => (
  <label {...props} className={cn("text-sm font-semibold text-gray-900", isDisabled && "text-gray-500", className)}>
    {children}
    {isRequired && (
      <span aria-hidden className="ms-1 text-negative">
        *
      </span>
    )}
  </label>
)
