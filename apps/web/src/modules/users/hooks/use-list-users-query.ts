import { useSuspenseQuery } from "@tanstack/react-query";
import { listUsersApi } from "../api";
import { usersKeys } from "../users.keys";
import type { PaginationOffsetParams } from "@reservo/types";

export function useListUsersQuery(params: PaginationOffsetParams) {
  return useSuspenseQuery({
    queryFn: () => listUsersApi(params),
    queryKey: usersKeys.users(params),
  });
}
