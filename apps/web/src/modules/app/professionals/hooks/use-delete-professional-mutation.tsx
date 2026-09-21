import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProfessionalApi } from "../api";
import { toast } from "sonner";
import { professionalsKeys } from "../professionals.keys";
import type { IListProfessionalsSchema } from "@reservo/types";

export function useDeleteProfessionalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfessionalApi,
    onSuccess: (_, { id }) => {
      toast.success("Profissional excluído com sucesso!");

      queryClient.setQueriesData<IListProfessionalsSchema.GetResponse>(
        {
          queryKey: professionalsKeys.all(),
        },
        (cache) => {
          if (!cache) return cache;

          return {
            ...cache,
            data: cache.data.filter((item) => item.professional.id !== id),
            meta: {
              ...cache.meta,
              total: Math.max(0, cache.meta.total - 1),
            },
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: professionalsKeys.all() });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
}
