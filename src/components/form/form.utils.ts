import { OnSubmitResult } from "hooks/useForm/useForm.types"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"

export const setFieldsErrors = <FormValues extends FieldValues>(
  errors: OnSubmitResult<FormValues>,
  formApi: UseFormReturn<FormValues>,
) => {
  if (!errors) return

  const { root, ...fieldErrors } = errors

  if (root) formApi.setError("root", { type: "global", message: root })

  Object.entries(fieldErrors).forEach(([name, message], index) => {
    if (message) formApi.setError(name as Path<FormValues>, { type: "server", message }, { shouldFocus: index === 0 })
  })
}
