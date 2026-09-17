import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeServiceApi } from "../api";
import { toast } from "sonner";
import type { IListServicesSchema } from "@reservo/types";
import { servicesKeys } from "../services.keys";

export function useRemoveServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeServiceApi,
    onSuccess: ({ service }) => {
      toast.success("Serviço excluído com sucesso!");

      queryClient.setQueriesData<IListServicesSchema.GetResponse>(
        {
          queryKey: servicesKeys.all(),
        },
        (cache) => {
          if (!cache) return cache;

          return {
            ...cache,
            data: cache.data.filter((item) => item.id !== service.id),
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
