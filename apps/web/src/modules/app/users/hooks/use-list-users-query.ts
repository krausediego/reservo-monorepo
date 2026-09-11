import { useSuspenseQuery } from "@tanstack/react-query";
import { listUsersApi } from "../api";
import { usersKeys } from "../users.keys";
import { useSearch } from "@tanstack/react-router";
import type { IListMembersSchema } from "@reservo/types";

export function useListUsersQuery(params: IListMembersSchema.GetParams) {
  const search = useSearch({ from: "/_app/users/" });

  const param = {
    ...params,
    ...search,
    roles: search.roles as string[] | undefined,
  };

  return useSuspenseQuery({
    queryFn: () => listUsersApi(param),
    queryKey: usersKeys.users(param),
  });
}
