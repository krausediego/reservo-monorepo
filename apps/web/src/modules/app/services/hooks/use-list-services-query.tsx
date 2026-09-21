import type { IListServicesSchema } from "@reservo/types";
import { listServicesQueryOptions } from "../services.queries";
import { useQuery } from "@tanstack/react-query";

export function useListServicesQuery(params: IListServicesSchema.GetParams) {
  return useQuery(listServicesQueryOptions(params));
}
