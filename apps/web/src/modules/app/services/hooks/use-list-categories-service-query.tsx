import { useQuery } from "@tanstack/react-query";
import { servicesKeys } from "../services.keys";
import { listCategoriesServiceApi } from "../api";

export function useListCategoriesServiceQuery() {
  return useQuery({
    queryKey: servicesKeys.categories(),
    queryFn: listCategoriesServiceApi,
  });
}
