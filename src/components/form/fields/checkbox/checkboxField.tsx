"use client"

import { useFieldController } from "hooks/useFieldController"

import { Checkbox } from "./checkbox"
import { CheckboxFieldProps } from "./checkboxField.types"

export const CheckboxField = (props: CheckboxFieldProps) => {
  const {
    field: { value, ...field },
    controlProps,
  } = useFieldController<CheckboxFieldProps>({ ...props, defaultValue: false })

  return <Checkbox {...controlProps} {...field} checked={!!value} />
}
