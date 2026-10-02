/* eslint-disable no-continue */
import { addMinutes, isBefore } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { IEstablishmentSchema, IProfessionalSchema } from "@reservo/types";

import { isWithinWorkingHours } from "./validate-working-hours";

const STEP = 15;

export function computeAvailableSlots({
  date,
  timezone,
  durationMin,
  establishmentHours,
  professionalHours,
  busy,
  now,
}: {
  date: string; // "2026-09-30"
  timezone: string;
  durationMin: number;
  establishmentHours: IEstablishmentSchema.EstablishmentAvailabilitiesParams[];
  professionalHours: IProfessionalSchema.ProfessionalAvailabilitiesParams[];
  busy: { startsAt: Date; endsAt: Date }[]; // appointments ativos + schedule blocks
  now?: Date;
}): Date[] {
  const nowDate = now ?? new Date();

  const dayStart = fromZonedTime(`${date}T00:00:00`, timezone);
  const dayEnd = addMinutes(dayStart, 24 * 60);
  const slots: Date[] = [];

  for (
    let start = dayStart;
    isBefore(start, dayEnd);
    start = addMinutes(start, STEP)
  ) {
    const end = addMinutes(start, durationMin);

    if (isBefore(start, nowDate)) {
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
