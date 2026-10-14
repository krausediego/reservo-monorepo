import { makeLogging, makeDatabase } from "@/infra";

import { ListCategoriesServiceService, type IListCategoriesService } from ".";

export const makeListCategoriesServiceService = (): IListCategoriesService => {
  return new ListCategoriesServiceService(makeLogging(), makeDatabase());
};
