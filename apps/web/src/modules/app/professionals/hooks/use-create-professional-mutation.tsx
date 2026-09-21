import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProfessionalApi } from "../api";
import { toast } from "sonner";
import type { IListProfessionalsSchema } from "@reservo/types";
import { professionalsKeys } from "../professionals.keys";

export function useCreateProfessionalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProfessionalApi,
    onSuccess: (professional) => {
      toast.success("Profissional criado com sucesso!");

      queryClient.setQueriesData<IListProfessionalsSchema.GetResponse>(
        { queryKey: professionalsKeys.all() },
        (cache) => {
          if (!cache) return cache;

          return {
            ...cache,
            data: [...cache.data, professional],
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
