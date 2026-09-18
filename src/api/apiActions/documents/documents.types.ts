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
