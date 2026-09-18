import { DefaultValues, FieldValues, UseFormProps as UseRHFormProps, UseFormReturn } from "react-hook-form"
import { z } from "zod"

export type { FieldValues }

export type FormErrors<FormValues extends FieldValues> = Partial<Record<keyof FormValues | "root", string>>

export type OnSubmitResult<FormValues extends FieldValues> = FormErrors<FormValues> | undefined | void

export type OnSubmitHandler<FormValues extends FieldValues> = (
  values: FormValues,
  formApi: UseFormReturn<FormValues>,
) => OnSubmitResult<FormValues> | Promise<OnSubmitResult<FormValues>>

export type UseFormProps<FormValues extends FieldValues> = Omit<
  UseRHFormProps<FormValues>,
  "resolver" | "defaultValues"
> & {
  onSubmit: OnSubmitHandler<FormValues>
  schema?: z.ZodType<FormValues, FormValues>
  defaultValues?: DefaultValues<FormValues>
}

export type UseFormReturnWithSubmit<FormValues extends FieldValues> = UseFormReturn<FormValues> & {
  handleOnSubmit: ReturnType<UseFormReturn<FormValues>["handleSubmit"]>
}
