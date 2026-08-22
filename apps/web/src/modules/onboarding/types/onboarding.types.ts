import type { ICreateEstablishmentSchema } from "@reservo/types";

export type IEstablishmentForm = Omit<
  ICreateEstablishmentSchema.GetParams,
  "establishmentAvailabilities" | "latitude" | "longitude"
>;

export type IMapForm = Pick<
  ICreateEstablishmentSchema.GetParams,
  "latitude" | "longitude"
>;

export type IAvailabilitiesForm = Pick<
  ICreateEstablishmentSchema.GetParams,
  "establishmentAvailabilities"
>;
