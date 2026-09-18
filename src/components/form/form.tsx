"use client"

import { useForm } from "hooks/useForm/useForm"

import { FieldValues, FormProps } from "./form.types"
import { FormBase } from "./formBase"

export const Form = <FormValues extends FieldValues>({ children, id, className, ...props }: FormProps<FormValues>) => {
  const methods = useForm<FormValues>(props)

  return (
    <FormBase methods={methods} id={id} className={className}>
      {children}
    </FormBase>
  )
}
