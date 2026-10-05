import type { IListCustomersSchema } from "@reservo/types";
import { queryOptions, type UseQueryOptions } from "@tanstack/react-query";
import { customersKeys } from "./customers.keys";
import { listCustomersApi } from "./api";

export type ListCustomersQueryOptions = Omit<
  UseQueryOptions<
    IListCustomersSchema.GetResponse, // TQueryFnData: o que o queryFn devolve
    Error, // TError
    IListCustomersSchema.GetResponse // TQueryKey
  >,
  "queryKey" | "queryFn"
>;

export function listCustomersQueryOptions(
  params: IListCustomersSchema.GetParams,
  config?: ListCustomersQueryOptions,
) {
  return queryOptions({
    queryKey: customersKeys.customers(params),
    queryFn: () => listCustomersApi(params),
    ...config,
  });
}
