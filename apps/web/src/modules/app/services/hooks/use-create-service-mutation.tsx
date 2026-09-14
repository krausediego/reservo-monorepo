import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createServiceApi } from "../api";
import { toast } from "sonner";
import type { IListServicesSchema } from "@reservo/types";
import { servicesKeys } from "../services.keys";

export function useCreateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createServiceApi,
    onSuccess: ({ service }) => {
      toast.success("Serviço criado com sucesso");

      queryClient.setQueriesData<IListServicesSchema.GetResponse>(
        {
          queryKey: servicesKeys.all(),
        },
        (cache) => {
          if (!cache) return cache;

          return {
            ...cache,
            data: [service, ...cache.data],
          };
        },
      );
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
}
