import { makeLogging } from "@/infra";

import { IStorage, R2Service } from ".";

export const makeStorage = (): IStorage => {
  return new R2Service(makeLogging());
};
