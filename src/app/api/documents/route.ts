import { DocumentsFailMode, MAX_SUBMIT_DELAY_MS } from "api/apiActions/documents/documents.constants"
import { submitDocumentAcceptedMockData, submitDocumentRejectedMockData } from "api/apiActions/documents/documents.mock"
import { Headers } from "constants/headers"
import { HttpStatus } from "constants/httpStatusCodes"
import { SearchParams } from "constants/searchParams"
import { NextRequest, NextResponse } from "next/server"

const readDelayMs = (value: Nullable<string>) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) return 0

  return Math.min(Math.trunc(parsed), MAX_SUBMIT_DELAY_MS)
}

const readAttempt = (value: Nullable<string>) => {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const shouldReject = (failMode: Nullable<string>, attempt: number) =>
  failMode === DocumentsFailMode.Always || (failMode === DocumentsFailMode.Once && attempt === 1)

export const POST = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const delayMs = readDelayMs(searchParams.get(SearchParams.Delay))

  if (delayMs > 0) await wait(delayMs)

  if (shouldReject(searchParams.get(SearchParams.Fail), readAttempt(request.headers.get(Headers.SubmitAttempt)))) {
    return NextResponse.json(submitDocumentRejectedMockData, { status: HttpStatus.UnprocessableEntity })
  }

  return NextResponse.json(submitDocumentAcceptedMockData, { status: HttpStatus.Accepted })
}
