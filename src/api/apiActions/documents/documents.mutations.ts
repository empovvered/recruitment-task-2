import { Headers } from "constants/headers"
import { mutationOptions } from "hooks/useMutation/useMutation.utils"

import { SubmitDocumentError } from "./documents.errors"
import {
  SubmitDocumentAcceptedResponse,
  SubmitDocumentRejectedResponse,
  SubmitDocumentVariables,
} from "./documents.types"

const FALLBACK_ERROR_MESSAGE = "Serwer nie podał powodu odrzucenia dokumentu."

const readRejection = async (response: Response) => {
  try {
    const body = (await response.json()) as Partial<SubmitDocumentRejectedResponse>
    const message = typeof body.message === "string" ? body.message.trim() : ""

    return new SubmitDocumentError(message || FALLBACK_ERROR_MESSAGE, { code: body.code, requestId: body.requestId })
  } catch {
    return new SubmitDocumentError(FALLBACK_ERROR_MESSAGE)
  }
}

export const submitDocument = async ({ payload, attempt }: SubmitDocumentVariables) => {
  const response = await fetch(`/api/documents${window.location.search}`, {
    method: "POST",
    headers: { [Headers.ContentType]: "application/json", [Headers.SubmitAttempt]: String(attempt) },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw await readRejection(response)

  return (await response.json()) as SubmitDocumentAcceptedResponse
}

export const documentsMutationsActions = {
  submitDocument: mutationOptions({ mutationFn: submitDocument }),
}
