import submitDocumentRejectedFixture from "data/submit-error.json"
import submitDocumentAcceptedFixture from "data/submit-success.json"

import { SubmitDocumentAcceptedResponse, SubmitDocumentRejectedResponse } from "./documents.types"

export const submitDocumentAcceptedMockData = submitDocumentAcceptedFixture as SubmitDocumentAcceptedResponse

export const submitDocumentRejectedMockData = submitDocumentRejectedFixture as SubmitDocumentRejectedResponse
