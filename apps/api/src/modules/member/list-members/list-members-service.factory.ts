import { makeLogging, makeDatabase } from "@/infra";

import { ListMembersService, type IListMembers } from ".";

export const makeListMembersService = (): IListMembers => {
  return new ListMembersService(makeLogging(), makeDatabase());
};
