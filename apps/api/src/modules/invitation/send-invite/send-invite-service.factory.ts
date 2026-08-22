import { makeLogging, makeDatabase } from "@/infra";

import { SendInviteService, type ISendInvite } from ".";

export const makeSendInviteService = (): ISendInvite => {
  return new SendInviteService(makeLogging(), makeDatabase());
};
