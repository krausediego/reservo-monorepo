import type { IListServicesSchema } from "@reservo/types";
import { queryOptions } from "@tanstack/react-query";
import { servicesKeys } from "./services.keys";
import { listServicesApi } from "./api";

export function listServicesQueryOptions(
  params: IListServicesSchema.GetParams,
) {
  return queryOptions({
    queryKey: servicesKeys.services(params),
    queryFn: () => listServicesApi(params),
  });
}
