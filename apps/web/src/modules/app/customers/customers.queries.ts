import type { IListCustomersSchema } from "@reservo/types";
import { queryOptions } from "@tanstack/react-query";
import { customersKeys } from "./customers.keys";
import { listCustomersApi } from "./api";

export function listCustomersQueryOptions(
  params: IListCustomersSchema.GetParams,
) {
  return queryOptions({
    queryKey: customersKeys.customers(params),
    queryFn: () => listCustomersApi(params),
  });
}
