import { useState } from "react"
import { screen, setup } from "tests"

import { Modal } from "./modal"

const Harness = ({ onClose = vi.fn() }: { onClose?: VoidFunction }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    onClose()
    setIsOpen(false)
  }

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Otwórz
      </button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Header header="Nowy dokument" />
        <Modal.Body>
          <label>
            Numer <input />
          </label>
          <label>
            Notatka <textarea />
          </label>
        </Modal.Body>
        <Modal.Footer>
          <button type="button">Wyślij</button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

describe("Modal", () => {
  it("opens as a named dialog with focus on its first interactive element", async () => {
    const { user } = setup(<Harness />)

    await user.click(screen.getByRole("button", { name: "Otwórz" }))

    expect(screen.getByRole("dialog", { name: "Nowy dokument" })).toHaveAttribute("aria-modal", "true")
    expect(screen.getByRole("textbox", { name: "Numer" })).toHaveFocus()
  })

  it("keeps Tab and Shift+Tab inside", async () => {
    const { user } = setup(<Harness />)

    await user.click(screen.getByRole("button", { name: "Otwórz" }))
    await user.tab({ shift: true })

    expect(screen.getByRole("button", { name: "Zamknij" })).toHaveFocus()

    await user.tab()

    expect(screen.getByRole("textbox", { name: "Numer" })).toHaveFocus()
  })

  it("closes on Escape and hands focus back to the opener", async () => {
    const onClose = vi.fn()
    const { user } = setup(<Harness onClose={onClose} />)

    await user.click(screen.getByRole("button", { name: "Otwórz" }))
    await user.keyboard("{Escape}")

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Otwórz" })).toHaveFocus()
  })
})
