import { useId } from "react"

type UseFieldIdsArgs = {
  id?: string
  hasDescription: boolean
  hasError: boolean
}

export const useFieldIds = ({ id, hasDescription, hasError }: UseFieldIdsArgs) => {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const descriptionId = `${fieldId}-description`
  const errorId = `${fieldId}-error`
  const describedBy = [hasDescription && descriptionId, hasError && errorId].filter(Boolean).join(" ")

  return { id: fieldId, descriptionId, errorId, describedBy: describedBy || undefined }
}
