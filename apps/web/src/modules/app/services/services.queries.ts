import type { IListServicesSchema } from "@reservo/types";
import { queryOptions, type UseQueryOptions } from "@tanstack/react-query";
import { servicesKeys } from "./services.keys";
import { listServicesApi } from "./api";

export type ListServicesQueryOptions = Omit<
  UseQueryOptions<
    IListServicesSchema.GetResponse, // TQueryFnData: o que o queryFn devolve
    Error, // TError
    IListServicesSchema.GetResponse // TQueryKey
  >,
  "queryKey" | "queryFn"
>;

export function listServicesQueryOptions(
  params: IListServicesSchema.GetParams,
  config?: ListServicesQueryOptions,
) {
  return queryOptions({
    queryKey: servicesKeys.services(params),
    queryFn: () => listServicesApi(params),
    ...config,
  });
}
