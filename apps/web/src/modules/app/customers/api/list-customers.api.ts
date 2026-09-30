import { clientAPI } from "@/lib/axios";
import type { IListCustomersSchema } from "@reservo/types";

export async function listCustomersApi(
  params: IListCustomersSchema.GetParams,
): Promise<IListCustomersSchema.GetResponse> {
  const { data } = await clientAPI.get<IListCustomersSchema.GetResponse>(
    "/customers",
    { params },
  );

  return data;
}
