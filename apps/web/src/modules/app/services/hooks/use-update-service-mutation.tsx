import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateServiceApi } from "../api";
import { toast } from "sonner";
import type { IListServicesSchema } from "@reservo/types";
import { servicesKeys } from "../services.keys";

export function useUpdateServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServiceApi,
    onSuccess: ({ service }) => {
      toast.success("Serviço atualizado com sucesso!");

      queryClient.setQueriesData<IListServicesSchema.GetResponse>(
        {
          queryKey: servicesKeys.all(),
        },
        (cache) => {
          if (!cache) return cache;

          return {
            ...cache,
            data: cache.data.map((data) =>
              data.id === service.id ? service : data,
            ),
          };
        },
      );
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
}
