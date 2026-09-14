import { clientAPI } from "@/lib/axios";
import type { IListServicesSchema } from "@reservo/types";

export async function listServicesApi(
  params: IListServicesSchema.GetParams,
): Promise<IListServicesSchema.GetResponse> {
  const { data } = await clientAPI.get<IListServicesSchema.GetResponse>(
    "/services",
    { params },
  );

  return data;
}
