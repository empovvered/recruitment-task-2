type SubmitDocumentErrorDetails = {
  code?: Nullable<string>
  requestId?: Nullable<string>
}

export class SubmitDocumentError extends Error {
  readonly code: Nullable<string>
  readonly requestId: Nullable<string>

  constructor(message: string, { code = null, requestId = null }: SubmitDocumentErrorDetails = {}) {
    super(message)
    this.name = "SubmitDocumentError"
    this.code = code
    this.requestId = requestId
  }
}

export const isSubmitDocumentError = (error: unknown): error is SubmitDocumentError =>
  error instanceof SubmitDocumentError
