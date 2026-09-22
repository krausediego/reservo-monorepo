import type { IListProfessionalsSchema } from "@reservo/types";
import { queryOptions } from "@tanstack/react-query";
import { professionalsKeys } from "./professionals.keys";
import { listProfessionalsApi } from "./api";

export function listProfessionalsQueryOptions(
  params: IListProfessionalsSchema.GetParams,
) {
  return queryOptions({
    queryKey: professionalsKeys.professionals(params),
    queryFn: () => listProfessionalsApi(params),
  });
}
