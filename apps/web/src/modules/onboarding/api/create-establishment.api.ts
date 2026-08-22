import { clientAPI } from "@/lib/axios";
import type { ICreateEstablishmentSchema } from "@reservo/types";

export async function createEstablishmentApi(
  params: ICreateEstablishmentSchema.GetParams,
): Promise<ICreateEstablishmentSchema.GetResponse> {
  const { data } = await clientAPI.post("/establishment", params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
