import { FieldValues, UseFormProps, UseFormReturnWithSubmit } from "hooks/useForm/useForm.types"
import { ReactNode } from "react"

export type { FieldValues }

type FormChildren<FormValues extends FieldValues> =
  ReactNode | ((methods: UseFormReturnWithSubmit<FormValues>) => ReactNode)

export type FormBaseProps<FormValues extends FieldValues> = {
  methods: UseFormReturnWithSubmit<FormValues>
  children: FormChildren<FormValues>
  id?: string
  className?: string
}

export type FormProps<FormValues extends FieldValues> = UseFormProps<FormValues> & {
  children: FormChildren<FormValues>
  id?: string
  className?: string
}
