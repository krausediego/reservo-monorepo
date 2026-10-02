import { clientAPI } from "@/lib/axios";
import type { IAvailabilitySlotsSchema } from "@reservo/types";

export async function availabilitySlotsApi(
  params: IAvailabilitySlotsSchema.GetParams,
): Promise<IAvailabilitySlotsSchema.GetResponse> {
  const { data } = await clientAPI.get<IAvailabilitySlotsSchema.GetResponse>(
    "/availability-slots",
    { params },
  );

  return data;
}
