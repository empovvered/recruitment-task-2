import { MutationFunction, useMutation as useRQMutation, UseMutationOptions } from "@tanstack/react-query"
import { mutations } from "api/apiActions"

import { GetMutationArgs, GetMutationResult, MutationsType } from "./useMutation.types"

export const useMutation = <Key extends keyof MutationsType, TError = Error, TContext = unknown>(
  mutation: Key,
  options?: UseMutationOptions<GetMutationResult<Key>, TError, GetMutationArgs<Key>[0], TContext>,
) => {
  const mutationFn = mutations[mutation].mutationFn as MutationFunction<GetMutationResult<Key>, GetMutationArgs<Key>[0]>

  return useRQMutation({ mutationKey: [mutation], mutationFn, ...options })
}
