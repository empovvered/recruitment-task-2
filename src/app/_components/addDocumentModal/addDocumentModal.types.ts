import { OnSubmitHandler } from "hooks/useForm/useForm.types"

import { AddDocumentFormValues } from "./addDocumentModal.schema"

export type AddDocumentModalProps = {
  isOpen: boolean
  onClose: VoidFunction
  onSubmit: OnSubmitHandler<AddDocumentFormValues>
}
