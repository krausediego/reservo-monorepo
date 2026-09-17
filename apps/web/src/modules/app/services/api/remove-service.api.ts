import { clientAPI } from "@/lib/axios";
import type { IRemoveServiceSchema } from "@reservo/types";

export async function removeServiceApi(
  params: IRemoveServiceSchema.GetParams,
): Promise<IRemoveServiceSchema.GetResponse> {
  const { data } = await clientAPI.delete<IRemoveServiceSchema.GetResponse>(
    `/service/${params.id}`,
  );

  return data;
}
