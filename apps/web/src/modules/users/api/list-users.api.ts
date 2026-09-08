import { clientAPI } from "@/lib/axios";
import type { IListMembersSchema } from "@reservo/types";

export async function listUsersApi(
  params: IListMembersSchema.GetParams,
): Promise<IListMembersSchema.GetResponse> {
  const { data } = await clientAPI.get<IListMembersSchema.GetResponse>(
    `/members`,
    { params },
  );

  return data;
}
