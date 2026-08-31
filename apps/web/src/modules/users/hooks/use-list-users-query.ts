import { useSuspenseQuery } from "@tanstack/react-query";
import { listUsersApi } from "../api";
import { usersKeys } from "../users.keys";

export function useListUsersQuery() {
  return useSuspenseQuery({
    queryFn: listUsersApi,
    queryKey: usersKeys.users(),
  });
}
