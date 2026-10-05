import type { IListServicesSchema } from "@reservo/types";
import {
  listServicesQueryOptions,
  type ListServicesQueryOptions,
} from "../services.queries";
import { useQuery } from "@tanstack/react-query";

export function useListServicesQuery(
  params: IListServicesSchema.GetParams,
  config?: ListServicesQueryOptions,
) {
  return useQuery(listServicesQueryOptions(params, config));
}
