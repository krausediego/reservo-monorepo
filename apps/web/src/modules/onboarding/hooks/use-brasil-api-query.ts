import { useQuery } from "@tanstack/react-query";
import { brasilApiKeys } from "../brasil-api.keys";
import { brasilApi, type BrasilApiProps } from "../api/brasil.api";

export function useBrasilApiQuery(params: BrasilApiProps) {
  return useQuery({
    queryKey: brasilApiKeys.address(),
    queryFn: () => brasilApi(params),
  });
}
