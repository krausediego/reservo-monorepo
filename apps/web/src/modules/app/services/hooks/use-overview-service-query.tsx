import { useQuery } from "@tanstack/react-query";
import { servicesKeys } from "../services.keys";
import { overviewServiceApi } from "../api";

export function useOverviewServiceQuery() {
  return useQuery({
    queryKey: servicesKeys.overview(),
    queryFn: overviewServiceApi,
  });
}
