import { useSuspenseQuery } from "@tanstack/react-query";
import { listProfessionalsApi } from "../api";
import type { IListProfessionalsSchema } from "@reservo/types";
import { professionalsKeys } from "../professionals.keys";

export function useListProfessionalsQuery(
  params: IListProfessionalsSchema.GetParams,
) {
  return useSuspenseQuery({
    queryFn: () => listProfessionalsApi(params),
    queryKey: professionalsKeys.professionals(params),
  });
}
