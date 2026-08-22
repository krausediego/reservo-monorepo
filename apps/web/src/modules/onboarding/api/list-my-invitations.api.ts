import { clientAPI } from "@/lib/axios";
import type { IListMyInvitationsSchema } from "@reservo/types";

export async function listMyInvitationsApi(): Promise<IListMyInvitationsSchema.GetResponse> {
  const { data } = await clientAPI.get<IListMyInvitationsSchema.GetResponse>(
    "/admin/list-my-invitations",
  );

  return data;
}
