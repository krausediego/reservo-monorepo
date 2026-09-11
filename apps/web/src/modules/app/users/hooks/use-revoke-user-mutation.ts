import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeUserApi } from "../api";
import { toast } from "sonner";
import { usersKeys } from "../users.keys";
import type { IListMembersSchema } from "@reservo/types";

export function useRevokeUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeUserApi,
    onSuccess: ({ message }, { id }) => {
      toast.success(message);

      queryClient.setQueriesData<IListMembersSchema.GetResponse>(
        {
          queryKey: usersKeys.all(),
        },
        (cache) => {
          if (!cache) return cache;

          return {
            ...cache,
            data: cache.data.filter((item) => item.member.id !== id),
            meta: {
              ...cache.meta,
              total: Math.max(0, cache.meta.total - 1),
            },
          };
        },
      );
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
}
