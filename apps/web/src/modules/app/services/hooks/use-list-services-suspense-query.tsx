import type { IListServicesSchema } from "@reservo/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { listServicesQueryOptions } from "../services.queries";

export function useListServicesSuspenseQuery(
  params: IListServicesSchema.GetParams,
) {
  return useSuspenseQuery(listServicesQueryOptions(params));
}
