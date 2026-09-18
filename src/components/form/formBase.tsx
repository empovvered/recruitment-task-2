"use client"

import { FormProvider } from "react-hook-form"

import { FieldValues, FormBaseProps } from "./form.types"

export const FormBase = <FormValues extends FieldValues>({
  methods,
  children,
  id,
  className,
}: FormBaseProps<FormValues>) => (
  <FormProvider {...methods}>
    <form id={id} onSubmit={methods.handleOnSubmit} noValidate className={className}>
      {typeof children === "function" ? children(methods) : children}
    </form>
  </FormProvider>
)
