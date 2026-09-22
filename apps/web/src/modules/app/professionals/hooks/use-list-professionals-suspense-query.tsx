import { useSuspenseQuery } from "@tanstack/react-query";
import type { IListProfessionalsSchema } from "@reservo/types";
import { listProfessionalsQueryOptions } from "../professionals.queries";

export function useListProfessionalsSuspenseQuery(
  params: IListProfessionalsSchema.GetParams,
) {
  return useSuspenseQuery(listProfessionalsQueryOptions(params));
}
