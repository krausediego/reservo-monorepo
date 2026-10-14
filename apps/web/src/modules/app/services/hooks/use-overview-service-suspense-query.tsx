import { useSuspenseQuery } from "@tanstack/react-query";
import { servicesKeys } from "../services.keys";
import { overviewServiceApi } from "../api";

export function useOverviewServiceSuspenseQuery() {
  return useSuspenseQuery({
    queryKey: servicesKeys.overview(),
    queryFn: overviewServiceApi,
  });
}
