import { useQuery } from "@tanstack/react-query";
import type { IListProfessionalsSchema } from "@reservo/types";
import {
  listProfessionalsQueryOptions,
  type ListProfessionalsQueryOptions,
} from "../professionals.queries";

export function useListProfessionalsQuery(
  params: IListProfessionalsSchema.GetParams,
  config?: ListProfessionalsQueryOptions,
) {
  return useQuery(listProfessionalsQueryOptions(params, config));
}
