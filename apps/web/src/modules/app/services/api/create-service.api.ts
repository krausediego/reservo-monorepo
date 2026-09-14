import { clientAPI } from "@/lib/axios";
import type { ICreateServiceSchema } from "@reservo/types";

export async function createServiceApi(
  params: ICreateServiceSchema.GetParams,
): Promise<ICreateServiceSchema.GetResponse> {
  const { data } = await clientAPI.post<ICreateServiceSchema.GetResponse>(
    "/service",
    params,
  );

  return data;
}
