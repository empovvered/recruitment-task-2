import { screen, setup } from "tests"

import { AddDocumentModal } from "./addDocumentModal"

const renderModal = () => {
  const onSubmit = vi.fn()

  return { onSubmit, ...setup(<AddDocumentModal isOpen onClose={vi.fn()} onSubmit={onSubmit} />) }
}

const fillValidDocument = async (user: ReturnType<typeof renderModal>["user"]) => {
  await user.type(screen.getByRole("textbox", { name: "Numer dokumentu" }), " ABC 123456 ")
  await user.type(screen.getByRole("textbox", { name: "E-mail właściciela" }), "anna@example.pl")
  await user.click(screen.getByRole("checkbox", { name: /Wyrażam zgodę/ }))
}

describe("AddDocumentModal", () => {
  it("names every missing field next to it, focuses the first one and keeps the submission", async () => {
    const { user, onSubmit } = renderModal()

    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    const documentNumber = screen.getByRole("textbox", { name: "Numer dokumentu" })

    expect(documentNumber).toBeInvalid()
    expect(documentNumber).toHaveAccessibleDescription("Numer dokumentu jest wymagany.")
    expect(documentNumber).toHaveFocus()
    expect(screen.getByRole("textbox", { name: "E-mail właściciela" })).toHaveAccessibleDescription(
      "E-mail właściciela jest wymagany.",
    )
    expect(screen.getByRole("checkbox", { name: /Wyrażam zgodę/ })).toHaveAccessibleDescription("Zgoda jest wymagana.")
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("tells a malformed e-mail from a missing one", async () => {
    const { user } = renderModal()

    await user.type(screen.getByRole("textbox", { name: "E-mail właściciela" }), "anna@example")
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    expect(screen.getByRole("textbox", { name: "E-mail właściciela" })).toHaveAccessibleDescription(
      "Podaj poprawny adres e-mail.",
    )
  })

  it("requires the note only for the type Other and caps it at 200 characters", async () => {
    const { user, onSubmit } = renderModal()
    const note = screen.getByRole("textbox", { name: "Notatka" })

    await fillValidDocument(user)
    await user.selectOptions(screen.getByRole("combobox", { name: "Typ dokumentu" }), "other")
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    expect(note).toBeRequired()
    expect(note).toHaveAccessibleDescription(/Dla typu Other notatka jest wymagana\./)
    expect(onSubmit).not.toHaveBeenCalled()

    await user.click(note)
    await user.paste("a".repeat(201))
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    expect(note).toHaveAccessibleDescription(/201\/200 Notatka może mieć najwyżej 200 znaków\./)
    expect(onSubmit).not.toHaveBeenCalled()

    await user.selectOptions(screen.getByRole("combobox", { name: "Typ dokumentu" }), "id")

    expect(note).not.toBeRequired()
    expect(note).toHaveAccessibleDescription(/201\/200 Notatka może mieć najwyżej 200 znaków\./)

    await user.clear(note)
    await user.type(note, "Skan z 2024 r.")
    await user.selectOptions(screen.getByRole("combobox", { name: "Typ dokumentu" }), "other")
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({ documentType: "other", note: "Skan z 2024 r." })
  })

  it("submits a complete document with its values trimmed", async () => {
    const { user, onSubmit } = renderModal()

    await fillValidDocument(user)
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      documentType: "id",
      documentNumber: "ABC 123456",
      ownerEmail: "anna@example.pl",
      consent: true,
      note: "",
    })
  })
})
