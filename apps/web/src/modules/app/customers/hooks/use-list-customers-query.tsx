import type { IListCustomersSchema } from "@reservo/types";
import {
  listCustomersQueryOptions,
  type ListCustomersQueryOptions,
} from "../customers.queries";
import { useQuery } from "@tanstack/react-query";

export function useListCustomersQuery(
  params: IListCustomersSchema.GetParams,
  config?: ListCustomersQueryOptions,
) {
  return useQuery(listCustomersQueryOptions(params, config));
}
