import { MAX_SUBMIT_DELAY_MS } from "api/apiActions/documents/documents.constants"
import { Headers } from "constants/headers"
import { HttpStatus } from "constants/httpStatusCodes"
import submitDocumentRejectedFixture from "data/submit-error.json"
import submitDocumentAcceptedFixture from "data/submit-success.json"
import { NextRequest } from "next/server"

import { POST } from "./route"

const validPayload = {
  documentType: "id",
  documentNumber: "ABC 123456",
  ownerEmail: "anna@example.pl",
  consent: true,
  note: "",
}

type PostOptions = {
  query?: string
  attempt?: number
}

const post = (body: unknown, { query = "", attempt }: PostOptions = {}) =>
  POST(
    new NextRequest(`http://localhost/api/documents${query}`, {
      method: "POST",
      headers: {
        [Headers.ContentType]: "application/json",
        ...(attempt !== undefined && { [Headers.SubmitAttempt]: String(attempt) }),
      },
      body: JSON.stringify(body),
    }),
  )

describe("POST /api/documents", () => {
  it("answers a valid submission with the success fixture", async () => {
    const response = await post(validPayload)

    expect(response.status).toBe(HttpStatus.Accepted)
    expect(await response.json()).toEqual(submitDocumentAcceptedFixture)
  })

  it("names the field when the body breaks the contract the form validates against", async () => {
    const response = await post({ ...validPayload, ownerEmail: "anna@example" })
    const body = (await response.json()) as { issues: { path: unknown[] }[] }

    expect(response.status).toBe(HttpStatus.BadRequest)
    expect(body.issues[0]?.path).toContain("ownerEmail")
  })

  it("answers with the error fixture on every attempt when asked to fail", async () => {
    const first = await post(validPayload, { query: "?fail=1", attempt: 1 })
    const second = await post(validPayload, { query: "?fail=1", attempt: 2 })

    expect(first.status).toBe(HttpStatus.UnprocessableEntity)
    expect(await first.json()).toEqual(submitDocumentRejectedFixture)
    expect(second.status).toBe(HttpStatus.UnprocessableEntity)
  })

  it("fails only the first attempt when asked to fail once, so a retry can succeed", async () => {
    const first = await post(validPayload, { query: "?fail=once" })
    const retry = await post(validPayload, { query: "?fail=once", attempt: 2 })

    expect(first.status).toBe(HttpStatus.UnprocessableEntity)
    expect(retry.status).toBe(HttpStatus.Accepted)
  })

  it("waits for the requested delay, capped, before answering", async () => {
    vi.useFakeTimers()

    try {
      const pending = post(validPayload, { query: "?delay=999999" })

      await vi.advanceTimersByTimeAsync(MAX_SUBMIT_DELAY_MS)

      expect((await pending).status).toBe(HttpStatus.Accepted)
    } finally {
      vi.useRealTimers()
    }
  })
})
