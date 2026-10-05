import type { IListProfessionalsSchema } from "@reservo/types";
import { queryOptions, type UseQueryOptions } from "@tanstack/react-query";
import { professionalsKeys } from "./professionals.keys";
import { listProfessionalsApi } from "./api";

export type ListProfessionalsQueryOptions = Omit<
  UseQueryOptions<
    IListProfessionalsSchema.GetResponse, // TQueryFnData: o que o queryFn devolve
    Error, // TError
    IListProfessionalsSchema.GetResponse // TQueryKey
  >,
  "queryKey" | "queryFn"
>;

export function listProfessionalsQueryOptions(
  params: IListProfessionalsSchema.GetParams,
  config?: ListProfessionalsQueryOptions,
) {
  return queryOptions({
    queryKey: professionalsKeys.professionals(params),
    queryFn: () => listProfessionalsApi(params),
    ...config,
  });
}
