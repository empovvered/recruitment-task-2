import { FieldErrorMessage } from "components/form/errorMessage/fieldErrorMessage"
import { Label } from "components/form/label/label"
import { getInputClassNames } from "components/form/utils/getInputClassNames"
import { useFieldIds } from "hooks/useFieldIds/useFieldIds"
import { cn } from "utils/cn"

import { SelectProps } from "./select.types"

export const Select = ({
  label,
  options,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  className,
  testId,
  id,
  ...props
}: SelectProps) => {
  const ids = useFieldIds({ id, hasDescription: false, hasError: !!errorMessage })
  const invalid = isInvalid || !!errorMessage

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label htmlFor={ids.id} isRequired={isRequired} isDisabled={isDisabled}>
        {label}
      </Label>
      <select
        {...props}
        id={ids.id}
        data-testid={testId}
        disabled={isDisabled}
        aria-required={isRequired || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={ids.describedBy}
        className={getInputClassNames({ isInvalid: invalid, isDisabled })}
      >
        {options.map(({ value, label: optionLabel }) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
      {errorMessage && <FieldErrorMessage id={ids.errorId}>{errorMessage}</FieldErrorMessage>}
    </div>
  )
}
