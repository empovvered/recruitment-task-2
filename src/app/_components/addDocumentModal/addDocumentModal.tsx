"use client"

import { isSubmitDocumentError } from "api/apiActions/documents/documents.errors"
import { submitDocumentPayloadSchema } from "api/apiActions/documents/documents.schema"
import { SubmitDocumentAcceptedResponse, SubmitDocumentPayload } from "api/apiActions/documents/documents.types"
import { Button } from "components/button/button"
import { CheckboxField } from "components/form/fields/checkbox/checkboxField"
import { InputField } from "components/form/fields/input/inputField"
import { SelectField } from "components/form/fields/select/selectField"
import { TextareaField } from "components/form/fields/textarea/textareaField"
import { Form } from "components/form/form"
import { Modal } from "components/modal/modal"
import { NOTE_MAX_INPUT_LENGTH } from "constants/forms"
import { OnSubmitHandler } from "hooks/useForm/useForm.types"
import { useMutation } from "hooks/useMutation/useMutation"
import { useEffect, useRef, useState } from "react"

import { ADD_DOCUMENT_FORM_DEFAULT_VALUES, DOCUMENT_TYPE_OPTIONS } from "./addDocumentModal.constants"
import { AddDocumentModalProps } from "./addDocumentModal.types"

const UNEXPECTED_ERROR_MESSAGE = "Nie udało się wysłać dokumentu. Spróbuj ponownie."

export const AddDocumentModal = ({ isOpen, onClose }: AddDocumentModalProps) => {
  const [accepted, setAccepted] = useState<Nullable<SubmitDocumentAcceptedResponse>>(null)
  const attemptRef = useRef(0)
  const acceptedHeadingRef = useRef<HTMLHeadingElement>(null)
  const { mutateAsync, isPending, reset } = useMutation("submitDocument")

  useEffect(() => {
    if (accepted) acceptedHeadingRef.current?.focus()
  }, [accepted])

  const handleClose = () => {
    if (isPending) return

    attemptRef.current = 0
    reset()
    setAccepted(null)
    onClose()
  }

  const handleSubmit: OnSubmitHandler<SubmitDocumentPayload> = async (payload) => {
    attemptRef.current += 1

    try {
      setAccepted(await mutateAsync({ payload, attempt: attemptRef.current }))
    } catch (error) {
      return { root: isSubmitDocumentError(error) ? error.message : UNEXPECTED_ERROR_MESSAGE }
    }
  }

  if (accepted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} testId="addDocumentModal">
        <Modal.Header header="Dokument przyjęty" ref={acceptedHeadingRef} tabIndex={-1} />
        <Modal.Body>
          <p className="text-base text-gray-900">{accepted.message}</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-gray-600">Identyfikator dokumentu</dt>
            <dd className="font-semibold text-gray-900">{accepted.documentId}</dd>
            <dt className="text-gray-600">Numer zgłoszenia</dt>
            <dd className="font-semibold text-gray-900">{accepted.requestId}</dd>
          </dl>
        </Modal.Body>
        <Modal.Footer>
          <Button testId="closeAddDocumentButton" onClick={handleClose}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} testId="addDocumentModal">
      <Form
        schema={submitDocumentPayloadSchema}
        defaultValues={ADD_DOCUMENT_FORM_DEFAULT_VALUES}
        onSubmit={handleSubmit}
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
              <p role="status" className="text-sm text-gray-600">
                {isPending && "Wysyłanie dokumentu…"}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button testId="cancelAddDocumentButton" variant="secondary" onClick={handleClose} isDisabled={isPending}>
                Anuluj
              </Button>
              <Button testId="submitAddDocumentButton" type="submit" isLoading={isPending}>
                Wyślij
              </Button>
            </Modal.Footer>
          </>
        )}
      </Form>
    </Modal>
  )
}
