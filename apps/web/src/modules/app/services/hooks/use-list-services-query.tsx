import type { IListServicesSchema } from "@reservo/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { listServicesApi } from "../api";
import { servicesKeys } from "../services.keys";
import { useSearch } from "@tanstack/react-router";

export function useListServicesQuery(params: IListServicesSchema.GetParams) {
  const search = useSearch({ from: "/_app/services/" });

  const param = {
    ...params,
    ...search,
  };

  return useSuspenseQuery({
    queryFn: () => listServicesApi(param),
    queryKey: servicesKeys.services(param),
  });
}
