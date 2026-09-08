import { clientAPI } from "@/lib/axios";
import type { IRevokeMemberSchema } from "@reservo/types";

export async function revokeUserApi(
  params: IRevokeMemberSchema.GetParams,
): Promise<IRevokeMemberSchema.GetResponse> {
  const { data } = await clientAPI.delete<IRevokeMemberSchema.GetResponse>(
    `/member/${params.id}`,
  );

  return data;
}
