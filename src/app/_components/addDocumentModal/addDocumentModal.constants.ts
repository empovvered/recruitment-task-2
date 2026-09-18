import { SubmitDocumentPayload } from "api/apiActions/documents/documents.types"
import { SelectOption } from "components/form/fields/select/select.types"

export const DOCUMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "id", label: "ID" },
  { value: "proof_of_income", label: "Proof of income" },
  { value: "other", label: "Other" },
]

export const ADD_DOCUMENT_FORM_DEFAULT_VALUES: SubmitDocumentPayload = {
  documentType: "id",
  documentNumber: "",
  ownerEmail: "",
  consent: false,
  note: "",
}
