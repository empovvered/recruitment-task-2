"use client"

import { AddDocumentModal } from "app/_components/addDocumentModal/addDocumentModal"
import { Button } from "components/button/button"
import { useState } from "react"

export const AddDocumentButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <Button testId="addDocumentButton" onClick={() => setIsModalOpen(true)}>
        Dodaj dokument
      </Button>
      <AddDocumentModal isOpen={isModalOpen} onClose={closeModal} onSubmit={closeModal} />
    </>
  )
}
