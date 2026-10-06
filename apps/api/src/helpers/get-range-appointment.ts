import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { IListAppointmentsSchema } from "@reservo/types";

export const getRangeAppointment = (
  view: IListAppointmentsSchema.GetParams["view"],
  date: IListAppointmentsSchema.GetParams["date"],
): {
  startsAt: Date;
  endsAt: Date;
} => {
  const dateParsed = parseISO(date);

  switch (view) {
    case "day":
      return {
        startsAt: startOfDay(dateParsed),
        endsAt: endOfDay(dateParsed),
      };
    case "week":
      return {
        startsAt: startOfWeek(dateParsed),
        endsAt: endOfWeek(dateParsed),
      };
    case "month":
      return {
        startsAt: startOfMonth(dateParsed),
        endsAt: endOfMonth(dateParsed),
      };
    case "agenda":
      return {
        startsAt: startOfMonth(dateParsed),
        endsAt: endOfMonth(dateParsed),
      };
    default:
      return {
        startsAt: startOfDay(dateParsed),
        endsAt: endOfDay(dateParsed),
      };
  }
};
