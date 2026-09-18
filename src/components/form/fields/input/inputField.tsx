"use client"

import { useFieldController } from "hooks/useFieldController"

import { Input } from "./input"
import { InputFieldProps } from "./inputField.types"

export const InputField = (props: InputFieldProps) => {
  const { field, controlProps } = useFieldController<InputFieldProps>({ ...props, defaultValue: "" })

  return <Input {...controlProps} {...field} />
}
