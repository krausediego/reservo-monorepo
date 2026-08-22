import { makeLogging, makeDatabase, makeStorage } from "@/infra";

import { MeService, type IMe } from ".";

export const makeMeService = (): IMe => {
  return new MeService(makeLogging(), makeDatabase(), makeStorage());
};
