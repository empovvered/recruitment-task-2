import submitDocumentAcceptedFixture from "data/submit-success.json"
import { screen, setup, waitFor } from "tests"

import { AddDocumentModal } from "./addDocumentModal"

const renderModal = () => {
  const fetchMock = vi.fn()

  vi.stubGlobal("fetch", fetchMock)

  return { fetchMock, ...setup(<AddDocumentModal isOpen onClose={vi.fn()} />) }
}

const fillValidDocument = async (user: ReturnType<typeof renderModal>["user"]) => {
  await user.type(screen.getByRole("textbox", { name: "Numer dokumentu" }), " ABC 123456 ")
  await user.type(screen.getByRole("textbox", { name: "E-mail właściciela" }), "anna@example.pl")
  await user.click(screen.getByRole("checkbox", { name: /Wyrażam zgodę/ }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("AddDocumentModal", () => {
  it("names every missing field next to it, focuses the first one and sends nothing", async () => {
    const { user, fetchMock } = renderModal()

    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    const documentNumber = screen.getByRole("textbox", { name: "Numer dokumentu" })

    expect(documentNumber).toBeInvalid()
    expect(documentNumber).toHaveAccessibleDescription("Numer dokumentu jest wymagany.")
    expect(documentNumber).toHaveFocus()
    expect(screen.getByRole("textbox", { name: "E-mail właściciela" })).toHaveAccessibleDescription(
      "E-mail właściciela jest wymagany.",
    )
    expect(screen.getByRole("checkbox", { name: /Wyrażam zgodę/ })).toHaveAccessibleDescription("Zgoda jest wymagana.")
    expect(fetchMock).not.toHaveBeenCalled()
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
    const { user, fetchMock } = renderModal()
    const note = screen.getByRole("textbox", { name: "Notatka" })

    fetchMock.mockResolvedValue(Response.json(submitDocumentAcceptedFixture, { status: 202 }))
    await fillValidDocument(user)
    await user.selectOptions(screen.getByRole("combobox", { name: "Typ dokumentu" }), "other")
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    expect(note).toBeRequired()
    expect(note).toHaveAccessibleDescription(/Dla typu Other notatka jest wymagana\./)
    expect(fetchMock).not.toHaveBeenCalled()

    await user.click(note)
    await user.paste("a".repeat(201))
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    expect(note).toHaveAccessibleDescription(/201\/200 Notatka może mieć najwyżej 200 znaków\./)
    expect(fetchMock).not.toHaveBeenCalled()

    await user.selectOptions(screen.getByRole("combobox", { name: "Typ dokumentu" }), "id")

    expect(note).not.toBeRequired()
    expect(note).toHaveAccessibleDescription(/201\/200 Notatka może mieć najwyżej 200 znaków\./)

    await user.clear(note)
    await user.type(note, "Skan z 2024 r.")
    await user.selectOptions(screen.getByRole("combobox", { name: "Typ dokumentu" }), "other")
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toMatchObject({
      documentType: "other",
      note: "Skan z 2024 r.",
    })
  })

  it("sends the trimmed document, shows the request in flight and then the accepted document", async () => {
    const { user, fetchMock } = renderModal()
    let answer: (response: Response) => void = () => undefined

    fetchMock.mockReturnValue(new Promise<Response>((resolve) => (answer = resolve)))
    await fillValidDocument(user)
    await user.click(screen.getByRole("button", { name: "Wyślij" }))

    const submit = screen.getByRole("button", { name: "Wyślij" })

    await waitFor(() => expect(submit).toHaveAttribute("aria-busy", "true"))
    expect(submit).toHaveFocus()
    expect(screen.getByRole("status")).toHaveTextContent("Wysyłanie dokumentu…")
    expect(screen.getByRole("button", { name: "Anuluj" })).toBeDisabled()
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toEqual({
      documentType: "id",
      documentNumber: "ABC 123456",
      ownerEmail: "anna@example.pl",
      consent: true,
      note: "",
    })

    answer(Response.json(submitDocumentAcceptedFixture, { status: 202 }))

    expect(await screen.findByText(submitDocumentAcceptedFixture.message)).toBeInTheDocument()
    expect(screen.getByText(submitDocumentAcceptedFixture.documentId)).toBeInTheDocument()
    expect(screen.getByText(submitDocumentAcceptedFixture.requestId)).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Dokument przyjęty" })).toHaveFocus()
  })
})
