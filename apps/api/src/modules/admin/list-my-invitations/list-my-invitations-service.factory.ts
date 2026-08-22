import { makeLogging, makeDatabase, makeStorage } from "@/infra";

import { ListMyInvitationsService, type IListMyInvitations } from ".";

export const makeListMyInvitationsService = (): IListMyInvitations => {
  return new ListMyInvitationsService(
    makeLogging(),
    makeDatabase(),
    makeStorage(),
  );
};
