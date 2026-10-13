import type { IListServicesSchema } from "@reservo/types";

export const servicesKeys = {
  all: () => ["services"] as const,
  services: (params: IListServicesSchema.GetParams) =>
    [...servicesKeys.all(), { ...params }] as const,
  overview: () => [...servicesKeys.all(), "overview"],
};
