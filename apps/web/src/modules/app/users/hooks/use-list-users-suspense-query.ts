import { useSuspenseQuery } from "@tanstack/react-query";
import type { IListMembersSchema } from "@reservo/types";
import { listUsersQueryOptions } from "../use.queries";

export function useListUsersSuspenseQuery(
  params: IListMembersSchema.GetParams,
) {
  return useSuspenseQuery(listUsersQueryOptions(params));
}
