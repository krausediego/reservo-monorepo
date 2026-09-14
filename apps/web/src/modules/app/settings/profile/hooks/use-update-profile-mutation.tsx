import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileApi } from "../api";
import { toast } from "sonner";
import type { IMeSchema } from "@reservo/types";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: ({ user }) => {
      toast.success("Perfil atualizado com sucesso");

      queryClient.setQueriesData<IMeSchema.GetResponse>(
        { queryKey: ["me"] },
        (cache) => {
          if (!cache) return cache;

          return {
            ...cache,
            user: {
              ...cache.user,
              name: user.name,
              phoneNumber: user.phoneNumber,
              imageUrl: user.imageUrl,
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
