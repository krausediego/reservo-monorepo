import type { IListProfessionalsSchema } from "@reservo/types";

export const professionalsKeys = {
  all: () => ["professionals"] as const,
  professionals: (params: IListProfessionalsSchema.GetParams) =>
    [...professionalsKeys.all(), { ...params }] as const,
};
