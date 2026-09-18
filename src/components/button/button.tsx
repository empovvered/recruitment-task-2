"use client"

import { cva } from "class-variance-authority"
import { LoadingIcon } from "components/icons/loadingIcon"
import { MouseEvent } from "react"
import { cn } from "utils/cn"

import { ButtonProps } from "./button.types"

export const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-base font-semibold transition duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none aria-disabled:cursor-progress",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300",
        secondary:
          "border border-primary bg-white text-primary hover:border-primary-dark hover:text-primary-dark disabled:border-gray-300 disabled:text-gray-500",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
)

export const Button = ({
  children,
  variant,
  isLoading = false,
  isDisabled = false,
  testId,
  className,
  type = "button",
  onClick,
  ...props
}: ButtonProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isLoading) {
      event.preventDefault()

      return
    }

    onClick?.(event)
  }

  return (
    <button
      {...props}
      type={type}
      data-testid={testId}
      disabled={isDisabled}
      aria-disabled={isLoading || undefined}
      aria-busy={isLoading || undefined}
      onClick={handleClick}
      className={cn(buttonVariants({ variant }), className)}
    >
      {isLoading && <LoadingIcon aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />}
      {children}
    </button>
  )
}
