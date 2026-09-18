import { cn } from "utils/cn"

type GetInputClassNamesArgs = {
  isInvalid: boolean
  isDisabled: boolean
  className?: string
}

export const getInputClassNames = ({ isInvalid, isDisabled, className }: GetInputClassNamesArgs) =>
  cn(
    "w-full rounded-lg border border-gray-500 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-500",
    "focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none",
    isInvalid && "border-negative focus:border-negative focus:ring-negative",
    isDisabled && "cursor-not-allowed bg-gray-100 text-gray-500",
    className,
  )
