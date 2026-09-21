import { useQuery } from "@tanstack/react-query";
import type { IListMembersSchema } from "@reservo/types";
import { listUsersQueryOptions } from "../use.queries";

export function useListUsersQuery(
  params: IListMembersSchema.GetParams,
  options?: Partial<ReturnType<typeof listUsersQueryOptions>>,
) {
  return useQuery({ ...listUsersQueryOptions(params), ...options });
}
