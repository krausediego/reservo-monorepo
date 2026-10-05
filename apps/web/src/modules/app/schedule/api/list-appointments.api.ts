import { clientAPI } from "@/lib/axios";
import type { IListAppointmentsSchema } from "@reservo/types";

export async function listAppointmentsApi(
  params: IListAppointmentsSchema.GetParams,
): Promise<IListAppointmentsSchema.GetResponse> {
  const { data } = await clientAPI.get<IListAppointmentsSchema.GetResponse>(
    "/appointments",
    { params },
  );

  return {
    ...data,
    data: data.data.map((appointment) => ({
      ...appointment,
      startsAt: new Date(appointment.startsAt),
      endsAt: new Date(appointment.endsAt),
    })),
  };
}
