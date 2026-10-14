import type { IController } from "@/modules/shared";

import {
  ListCategoriesServiceController,
  makeListCategoriesServiceService,
} from ".";

export const makeListCategoriesServiceController = (): IController => {
  return new ListCategoriesServiceController(makeListCategoriesServiceService);
};
