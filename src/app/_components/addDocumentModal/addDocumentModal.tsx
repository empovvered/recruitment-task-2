"use client"

import { Button } from "components/button/button"
import { CheckboxField } from "components/form/fields/checkbox/checkboxField"
import { InputField } from "components/form/fields/input/inputField"
import { SelectField } from "components/form/fields/select/selectField"
import { TextareaField } from "components/form/fields/textarea/textareaField"
import { Form } from "components/form/form"
import { Modal } from "components/modal/modal"
import { NOTE_MAX_INPUT_LENGTH } from "constants/forms"

import { ADD_DOCUMENT_FORM_DEFAULT_VALUES, DOCUMENT_TYPE_OPTIONS } from "./addDocumentModal.constants"
import { addDocumentFormSchema } from "./addDocumentModal.schema"
import { AddDocumentModalProps } from "./addDocumentModal.types"

export const AddDocumentModal = ({ isOpen, onClose, onSubmit }: AddDocumentModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} testId="addDocumentModal">
    <Form
      schema={addDocumentFormSchema}
      defaultValues={ADD_DOCUMENT_FORM_DEFAULT_VALUES}
      onSubmit={onSubmit}
      className="flex min-h-0 flex-col gap-6"
    >
      {({ watch, trigger, formState }) => (
        <>
          <Modal.Header header="Dodaj dokument" />
          <Modal.Body>
            <SelectField
              name="documentType"
              label="Typ dokumentu"
              options={DOCUMENT_TYPE_OPTIONS}
              onChange={() => formState.isSubmitted && trigger("note")}
              isRequired
              testId="documentType"
            />
            <InputField
              name="documentNumber"
              label="Numer dokumentu"
              autoComplete="off"
              isRequired
              testId="documentNumber"
            />
            <InputField
              name="ownerEmail"
              type="email"
              label="E-mail właściciela"
              autoComplete="email"
              isRequired
              testId="ownerEmail"
            />
            <CheckboxField
              name="consent"
              label="Wyrażam zgodę na przetwarzanie danych zawartych w dokumencie"
              isRequired
              testId="consent"
            />
            <TextareaField
              name="note"
              label="Notatka"
              characterLimit={NOTE_MAX_INPUT_LENGTH}
              isRequired={watch("documentType") === "other"}
              testId="note"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button testId="cancelAddDocumentButton" variant="secondary" onClick={onClose}>
              Anuluj
            </Button>
            <Button testId="submitAddDocumentButton" type="submit">
              Wyślij
            </Button>
          </Modal.Footer>
        </>
      )}
    </Form>
  </Modal>
)
