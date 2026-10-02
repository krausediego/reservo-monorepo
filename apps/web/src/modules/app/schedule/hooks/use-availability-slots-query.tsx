import type { IAvailabilitySlotsSchema } from "@reservo/types";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { availabilitySlotsApi } from "../api";

type AvailabilitySlotsQueryOptions = Omit<
  UseQueryOptions<
    IAvailabilitySlotsSchema.GetResponse, // TQueryFnData: o que o queryFn devolve
    Error, // TError
    IAvailabilitySlotsSchema.GetResponse // TQueryKey
  >,
  "queryKey" | "queryFn"
>;

export function useAvailabilitySlots(
  params: IAvailabilitySlotsSchema.GetParams,
  config?: AvailabilitySlotsQueryOptions,
) {
  return useQuery({
    queryFn: () => availabilitySlotsApi(params),
    queryKey: ["availability-slots", params],
    staleTime: 0,
    ...config,
  });
}
