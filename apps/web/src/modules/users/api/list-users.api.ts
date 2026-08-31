import { clientAPI } from "@/lib/axios";
import type { IListMembersSchema } from "@reservo/types";

export async function listUsersApi(): Promise<IListMembersSchema.GetResponse> {
  const { data } =
    await clientAPI.get<IListMembersSchema.GetResponse>("/members");

  return data;
}
