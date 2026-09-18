import { SubmitDocumentPayload } from "api/apiActions/documents/documents.types"
import { OnSubmitHandler } from "hooks/useForm/useForm.types"

export type AddDocumentModalProps = {
  isOpen: boolean
  onClose: VoidFunction
  onSubmit: OnSubmitHandler<SubmitDocumentPayload>
}
