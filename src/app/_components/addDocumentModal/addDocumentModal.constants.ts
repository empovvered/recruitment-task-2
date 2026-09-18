import { SelectOption } from "components/form/fields/select/select.types"

import { AddDocumentFormValues } from "./addDocumentModal.schema"

export const DOCUMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "id", label: "ID" },
  { value: "proof_of_income", label: "Proof of income" },
  { value: "other", label: "Other" },
]

export const ADD_DOCUMENT_FORM_DEFAULT_VALUES: AddDocumentFormValues = {
  documentType: "id",
  documentNumber: "",
  ownerEmail: "",
  consent: false,
  note: "",
}
