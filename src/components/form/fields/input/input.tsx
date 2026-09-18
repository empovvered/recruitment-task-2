import { FieldErrorMessage } from "components/form/errorMessage/fieldErrorMessage"
import { Label } from "components/form/label/label"
import { getInputClassNames } from "components/form/utils/getInputClassNames"
import { useFieldIds } from "hooks/useFieldIds/useFieldIds"
import { cn } from "utils/cn"

import { InputProps } from "./input.types"

export const Input = ({
  label,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  className,
  testId,
  id,
  type = "text",
  ...props
}: InputProps) => {
  const ids = useFieldIds({ id, hasDescription: false, hasError: !!errorMessage })
  const invalid = isInvalid || !!errorMessage

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label htmlFor={ids.id} isRequired={isRequired} isDisabled={isDisabled}>
        {label}
      </Label>
      <input
        {...props}
        id={ids.id}
        type={type}
        data-testid={testId}
        disabled={isDisabled}
        aria-required={isRequired || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={ids.describedBy}
        className={getInputClassNames({ isInvalid: invalid, isDisabled })}
      />
      {errorMessage && <FieldErrorMessage id={ids.errorId}>{errorMessage}</FieldErrorMessage>}
    </div>
  )
}
