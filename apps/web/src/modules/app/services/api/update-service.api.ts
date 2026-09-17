import { clientAPI } from "@/lib/axios";
import type { IUpdateServiceSchema } from "@reservo/types";

export async function updateServiceApi(
  params: IUpdateServiceSchema.GetParams,
): Promise<IUpdateServiceSchema.GetResponse> {
  const { data } = await clientAPI.put<IUpdateServiceSchema.GetResponse>(
    `/service/${params.id}`,
    params,
  );

  return data;
}
