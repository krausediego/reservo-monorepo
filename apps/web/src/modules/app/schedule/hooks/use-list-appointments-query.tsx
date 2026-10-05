import type { IListAppointmentsSchema } from "@reservo/types";
import { useQuery } from "@tanstack/react-query";
import { listAppointmentsApi } from "../api";

export function useListAppointmentsQuery(
  params: IListAppointmentsSchema.GetParams,
) {
  return useQuery({
    queryFn: () => listAppointmentsApi(params),
    queryKey: ["appointments"],
  });
}
