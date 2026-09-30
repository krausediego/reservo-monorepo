import type { IListCustomersSchema } from "@reservo/types";

export const customersKeys = {
  all: () => ["customers"] as const,
  customers: (params: IListCustomersSchema.GetParams) =>
    [...customersKeys.all(), { ...params }] as const,
};
