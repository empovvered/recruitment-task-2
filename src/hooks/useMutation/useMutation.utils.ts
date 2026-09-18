import { MutationFunction } from "@tanstack/react-query"

export const mutationOptions = <TData, TVariables>(options: { mutationFn: MutationFunction<TData, TVariables> }) =>
  options
