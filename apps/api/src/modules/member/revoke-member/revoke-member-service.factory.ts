import { makeLogging, makeDatabase } from "@/infra";

import { RevokeMemberService, type IRevokeMember } from ".";

export const makeRevokeMemberService = (): IRevokeMember => {
  return new RevokeMemberService(makeLogging(), makeDatabase());
};
