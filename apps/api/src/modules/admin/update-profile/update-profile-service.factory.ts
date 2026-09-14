import { makeLogging, makeDatabase, makeStorage } from "@/infra";

import { UpdateProfileService, type IUpdateProfile } from ".";

export const makeUpdateProfileService = (): IUpdateProfile => {
  return new UpdateProfileService(makeLogging(), makeDatabase(), makeStorage());
};
