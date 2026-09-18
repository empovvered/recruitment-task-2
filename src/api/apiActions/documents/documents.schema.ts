import { NOTE_MAX_INPUT_LENGTH, REQUIRED_MIN_INPUT_LENGTH } from "constants/forms"
import { DOCUMENT_TYPES } from "types/documents"
import { z } from "zod"

import { SubmitDocumentPayload } from "./documents.types"

export const submitDocumentPayloadSchema = z
  .object({
    documentType: z.literal(DOCUMENT_TYPES, { error: "Wybierz typ dokumentu." }),
    documentNumber: z.string().trim().min(REQUIRED_MIN_INPUT_LENGTH, { error: "Numer dokumentu jest wymagany." }),
    ownerEmail: z
      .string()
      .trim()
      .min(REQUIRED_MIN_INPUT_LENGTH, { error: "E-mail właściciela jest wymagany." })
      .pipe(z.email({ error: "Podaj poprawny adres e-mail." })),
    consent: z.boolean().refine(Boolean, { error: "Zgoda jest wymagana." }),
    note: z
      .string()
      .trim()
      .max(NOTE_MAX_INPUT_LENGTH, { error: `Notatka może mieć najwyżej ${NOTE_MAX_INPUT_LENGTH} znaków.` }),
  })
  .check((context) => {
    if (context.value.documentType === "other" && !context.value.note) {
      context.issues.push({
        code: "custom",
        path: ["note"],
        message: "Dla typu Other notatka jest wymagana.",
        input: context.value.note,
      })
    }
  }) satisfies z.ZodType<SubmitDocumentPayload>
