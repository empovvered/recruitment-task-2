"use client"

import { useFieldController } from "hooks/useFieldController"

import { Select } from "./select"
import { SelectFieldProps } from "./selectField.types"

export const SelectField = (props: SelectFieldProps) => {
  const { field, controlProps } = useFieldController<SelectFieldProps>({
    ...props,
    defaultValue: props.options[0]?.value ?? "",
  })

  return <Select {...controlProps} {...field} />
}
