export const DOCUMENT_TYPES = ["id", "proof_of_income", "other"] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]
