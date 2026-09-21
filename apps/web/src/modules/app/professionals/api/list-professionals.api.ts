import { clientAPI } from "@/lib/axios";
import type { IListProfessionalsSchema } from "@reservo/types";

export async function listProfessionalsApi(
  params: IListProfessionalsSchema.GetParams,
): Promise<IListProfessionalsSchema.GetResponse> {
  const { data } = await clientAPI.get<IListProfessionalsSchema.GetResponse>(
    "/professionals",
    { params },
  );

  return data;
}
