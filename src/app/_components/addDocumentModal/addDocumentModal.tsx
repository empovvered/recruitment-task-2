"use client"

import { Button } from "components/button/button"
import { Modal } from "components/modal/modal"

import { AddDocumentModalProps } from "./addDocumentModal.types"

export const AddDocumentModal = ({ isOpen, onClose }: AddDocumentModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} testId="addDocumentModal">
    <Modal.Header header="Dodaj dokument" />
    <Modal.Body>
      <p className="text-base text-gray-600">Wypełnij formularz, aby przekazać dokument do weryfikacji.</p>
    </Modal.Body>
    <Modal.Footer>
      <Button testId="cancelAddDocumentButton" variant="secondary" onClick={onClose}>
        Anuluj
      </Button>
    </Modal.Footer>
  </Modal>
)
