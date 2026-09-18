import { zodResolver } from "@hookform/resolvers/zod"
import { setFieldsErrors } from "components/form/form.utils"
import { SubmitHandler, useForm as useRHForm } from "react-hook-form"

import { FieldValues, UseFormProps, UseFormReturnWithSubmit } from "./useForm.types"

export const useForm = <FormValues extends FieldValues>({
  onSubmit,
  schema,
  ...props
}: UseFormProps<FormValues>): UseFormReturnWithSubmit<FormValues> => {
  const methods = useRHForm<FormValues>({
    ...(schema && { resolver: zodResolver(schema) }),
    ...props,
  })

  const handleOnValid: SubmitHandler<FormValues> = async (values) => {
    setFieldsErrors(await onSubmit(values, methods), methods)
  }

  return {
    ...methods,
    handleOnSubmit: methods.handleSubmit(handleOnValid),
  }
}
