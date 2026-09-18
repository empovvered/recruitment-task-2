import { FieldErrorMessage } from "components/form/errorMessage/fieldErrorMessage"
import { Label } from "components/form/label/label"
import { useFieldIds } from "hooks/useFieldIds/useFieldIds"
import { cn } from "utils/cn"

import { CheckboxProps } from "./checkbox.types"

export const Checkbox = ({
  label,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  className,
  testId,
  id,
  ...props
}: CheckboxProps) => {
  const ids = useFieldIds({ id, hasDescription: false, hasError: !!errorMessage })
  const invalid = isInvalid || !!errorMessage

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-start gap-3">
        <input
          {...props}
          id={ids.id}
          type="checkbox"
          data-testid={testId}
          disabled={isDisabled}
          aria-required={isRequired || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={ids.describedBy}
          className={cn(
            "mt-0.5 size-5 shrink-0 accent-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
            invalid && "outline outline-negative",
            isDisabled && "cursor-not-allowed",
          )}
        />
        <Label htmlFor={ids.id} isRequired={isRequired} isDisabled={isDisabled} className="font-normal">
          {label}
        </Label>
      </div>
      {errorMessage && (
        <FieldErrorMessage id={ids.errorId} className="ps-8">
          {errorMessage}
        </FieldErrorMessage>
      )}
    </div>
  )
}
