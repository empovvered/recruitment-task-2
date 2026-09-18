"use client"

import { useFieldController } from "hooks/useFieldController"

import { Textarea } from "./textarea"
import { TextareaFieldProps } from "./textareaField.types"

export const TextareaField = (props: TextareaFieldProps) => {
  const { field, controlProps } = useFieldController<TextareaFieldProps>({ ...props, defaultValue: "" })

  return <Textarea {...controlProps} {...field} />
}
