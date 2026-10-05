/* eslint-disable no-continue */
import { addMinutes, isBefore } from "date-fns";

import { IEstablishmentSchema, IProfessionalSchema } from "@reservo/types";

import { isWithinWorkingHours } from "./validate-working-hours";

export function computeAvailableSlots({
  dayStart,
  dayEnd,
  timezone,
  durationMin,
  establishmentHours,
  professionalHours,
  busy,
  step = 15,
  now,
  allowPast = true,
}: {
  dayStart: Date;
  dayEnd: Date;
  timezone: string;
  durationMin: number;
  establishmentHours: IEstablishmentSchema.EstablishmentAvailabilitiesParams[];
  professionalHours: IProfessionalSchema.ProfessionalAvailabilitiesParams[];
  busy: { startsAt: Date; endsAt: Date }[];
  step?: number;
  now?: Date;
  allowPast?: boolean;
}): Date[] {
  const nowDate = now ?? new Date();
  const slots: Date[] = [];

  for (
    let start = dayStart;
    isBefore(start, dayEnd);
    start = addMinutes(start, step)
  ) {
    const end = addMinutes(start, durationMin);

    if (!allowPast && isBefore(start, nowDate)) {
      continue;
    }
    if (
      !isWithinWorkingHours({
        startsAt: start,
        endsAt: end,
        timezone,
        hours: establishmentHours,
      })
    ) {
      continue;
    }
    if (
      !isWithinWorkingHours({
        startsAt: start,
        endsAt: end,
        timezone,
        hours: professionalHours,
      })
    ) {
      continue;
    }
    if (
      busy.some((b) => isBefore(start, b.endsAt) && isBefore(b.startsAt, end))
    ) {
      continue;
    }

    slots.push(start);
  }

  return slots;
}
