import submitDocumentRejectedFixture from "data/submit-error.json"
import submitDocumentAcceptedFixture from "data/submit-success.json"

import { isSubmitDocumentError } from "./documents.errors"
import { submitDocument } from "./documents.mutations"
import { SubmitDocumentPayload } from "./documents.types"

const payload: SubmitDocumentPayload = {
  documentType: "id",
  documentNumber: "ABC 123456",
  ownerEmail: "anna@example.pl",
  consent: true,
  note: "",
}

const mockFetch = (response: Response) => {
  const fetchMock = vi.fn().mockResolvedValue(response)

  vi.stubGlobal("fetch", fetchMock)

  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("submitDocument", () => {
  it("posts the document and numbers the attempt, so the endpoint can fail the first one only", async () => {
    const fetchMock = mockFetch(Response.json(submitDocumentAcceptedFixture, { status: 202 }))

    const result = await submitDocument({ payload, attempt: 2 })

    expect(result).toEqual(submitDocumentAcceptedFixture)
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/documents",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "X-Submit-Attempt": "2" }),
        body: JSON.stringify(payload),
      }),
    )
  })

  it("reports what the server said when it refuses the document", async () => {
    mockFetch(Response.json(submitDocumentRejectedFixture, { status: 422 }))

    await expect(submitDocument({ payload, attempt: 1 })).rejects.toMatchObject({
      message: submitDocumentRejectedFixture.message,
      code: submitDocumentRejectedFixture.code,
      requestId: submitDocumentRejectedFixture.requestId,
    })
  })

  it("survives an answer that is not JSON, such as a proxy error page", async () => {
    mockFetch(new Response("<html>502 Bad Gateway</html>", { status: 502 }))

    const error = await submitDocument({ payload, attempt: 1 }).catch((caught: unknown) => caught)

    expect(error).toSatisfy(isSubmitDocumentError)
    expect(error).toMatchObject({ message: "Serwer nie podał powodu odrzucenia dokumentu." })
  })
})
