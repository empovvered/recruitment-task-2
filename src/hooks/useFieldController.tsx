import { ControllerRenderProps, useController, UseControllerProps, UseControllerReturn } from "react-hook-form"

type FormControlProps = {
  isInvalid: boolean
  errorMessage?: string
}

export type BaseControlProps = {
  name: string
  isInvalid?: boolean
  errorMessage?: string
  onChange?: ControllerRenderProps["onChange"]
} & Record<string, unknown>

export type UseFieldControllerProps<ControlProps extends BaseControlProps> = ControlProps &
  Pick<UseControllerProps, "defaultValue" | "shouldUnregister">

export type UseFieldControllerReturn<ControlProps extends BaseControlProps> = UseControllerReturn & {
  controlProps: ControlProps & FormControlProps
}

export const useFieldController = <ControlProps extends BaseControlProps>({
  name,
  defaultValue = "",
  shouldUnregister,
  onChange,
  ...props
}: UseFieldControllerProps<ControlProps>): UseFieldControllerReturn<ControlProps> => {
  const controller = useController({ name, defaultValue, shouldUnregister })
  const { error } = controller.fieldState

  const handleChange: ControllerRenderProps["onChange"] = (...event) => {
    controller.field.onChange(...event)
    onChange?.(...event)
  }

  return {
    ...controller,
    field: { ...controller.field, onChange: handleChange },
    controlProps: {
      ...(props as unknown as ControlProps),
      isInvalid: !!error || !!props.isInvalid,
      errorMessage: props.errorMessage ?? error?.message,
    },
  }
}
