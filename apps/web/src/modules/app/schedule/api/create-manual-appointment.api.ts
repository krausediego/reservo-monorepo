import { clientAPI } from "@/lib/axios";
import type { ICreateManualAppointmentSchema } from "@reservo/types";

export async function createManualAppointmentApi(
  params: ICreateManualAppointmentSchema.GetInput,
): Promise<ICreateManualAppointmentSchema.GetResponse> {
  const { data } =
    await clientAPI.post<ICreateManualAppointmentSchema.GetResponse>(
      "/manual-appointment",
      params,
    );

  return data;
}
