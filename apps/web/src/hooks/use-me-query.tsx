import { adminMeApi } from "@/api";
import { queryOptions, useQuery } from "@tanstack/react-query";

export function useMeQuery() {
  return useQuery({
    queryFn: adminMeApi,
    queryKey: ["me"],
  });
}

export const meQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: adminMeApi,
});
