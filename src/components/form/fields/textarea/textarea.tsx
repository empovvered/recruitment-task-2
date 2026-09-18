import { FieldErrorMessage } from "components/form/errorMessage/fieldErrorMessage"
import { Label } from "components/form/label/label"
import { getInputClassNames } from "components/form/utils/getInputClassNames"
import { useFieldIds } from "hooks/useFieldIds/useFieldIds"
import { cn } from "utils/cn"

import { TextareaProps } from "./textarea.types"

export const Textarea = ({
  label,
  errorMessage,
  characterLimit,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  className,
  testId,
  id,
  value,
  ...props
}: TextareaProps) => {
  const characterCount = typeof value === "string" ? value.trim().length : undefined
  const hasCounter = characterLimit !== undefined && characterCount !== undefined
  const isOverLimit = hasCounter && characterCount > characterLimit
  const ids = useFieldIds({ id, hasDescription: hasCounter, hasError: !!errorMessage })
  const invalid = isInvalid || !!errorMessage

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label htmlFor={ids.id} isRequired={isRequired} isDisabled={isDisabled}>
        {label}
      </Label>
      <textarea
        {...props}
        id={ids.id}
        value={value}
        data-testid={testId}
        disabled={isDisabled}
        aria-required={isRequired || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={ids.describedBy}
        className={getInputClassNames({ isInvalid: invalid, isDisabled, className: "min-h-24 resize-y" })}
      />
      {hasCounter && (
        <p id={ids.descriptionId} className={cn("self-end text-sm text-gray-600", isOverLimit && "text-negative")}>
          {characterCount}/{characterLimit}
        </p>
      )}
      {errorMessage && <FieldErrorMessage id={ids.errorId}>{errorMessage}</FieldErrorMessage>}
    </div>
  )
}
