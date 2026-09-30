import type { IListCustomersSchema } from "@reservo/types";
import { listCustomersQueryOptions } from "../customers.queries";
import { useQuery } from "@tanstack/react-query";

export function useListCustomersQuery(params: IListCustomersSchema.GetParams) {
  return useQuery(listCustomersQueryOptions(params));
}
