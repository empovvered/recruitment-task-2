import { DocumentType } from "types/documents"

export type SubmitDocumentPayload = {
  documentType: DocumentType
  documentNumber: string
  ownerEmail: string
  consent: boolean
  note: string
}

export type SubmitDocumentVariables = {
  payload: SubmitDocumentPayload
  attempt: number
}

export type SubmitDocumentAcceptedResponse = {
  requestId: string
  status: "accepted"
  message: string
  documentId: string
}

export type SubmitDocumentRejectedResponse = {
  requestId: string
  status: "error"
  code: string
  message: string
}
