import { makeLogging, makeDatabase, makeStorage } from "@/infra";

import { ListProfessionalsService, type IListProfessionals } from ".";

export const makeListProfessionalsService = (): IListProfessionals => {
  return new ListProfessionalsService(
    makeLogging(),
    makeDatabase(),
    makeStorage(),
  );
};
