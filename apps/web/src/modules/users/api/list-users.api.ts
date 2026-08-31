import { clientAPI } from "@/lib/axios";
import type {
  IListMembersSchema,
  PaginationOffsetParams,
} from "@reservo/types";

export async function listUsersApi({
  page,
  limit,
}: PaginationOffsetParams): Promise<IListMembersSchema.GetResponse> {
  const { data } = await clientAPI.get<IListMembersSchema.GetResponse>(
    `/members`,
    { params: { page, limit } },
  );

  return data;
}
