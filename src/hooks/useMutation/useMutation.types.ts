import { mutations } from "api/apiActions"

export type MutationsType = typeof mutations

export type GetMutationArgs<Key extends keyof MutationsType> = Parameters<MutationsType[Key]["mutationFn"]>

export type GetMutationResult<Key extends keyof MutationsType> = Awaited<ReturnType<MutationsType[Key]["mutationFn"]>>
