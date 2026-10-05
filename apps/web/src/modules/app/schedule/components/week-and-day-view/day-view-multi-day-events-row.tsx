import {
  isWithinInterval,
  differenceInDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import { MonthEventBadge } from "../month-view/month-event-badge";
import type { IListAppointmentsSchema } from "@reservo/types";

type DayViewMultiDayEventsRowProps = {
  selectedDate: Date;
  multiDayAppointments: IListAppointmentsSchema.GetResponse["data"];
};

export function DayViewMultiDayEventsRow({
  selectedDate,
  multiDayAppointments,
}: DayViewMultiDayEventsRowProps) {
  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);

  const multiDayAppointmentsInDay = multiDayAppointments
    .filter((appointment) => {
      const appointmentStart = appointment.startsAt;
      const appointmentEnd = appointment.endsAt;

      const isOverlapping =
        isWithinInterval(dayStart, {
          start: appointmentStart,
          end: appointmentEnd,
        }) ||
        isWithinInterval(dayEnd, {
          start: appointmentStart,
          end: appointmentEnd,
        }) ||
        (appointmentStart <= dayStart && appointmentEnd >= dayEnd);

      return isOverlapping;
    })
    .sort((a, b) => {
      const durationA = differenceInDays(a.endsAt, a.startsAt);
      const durationB = differenceInDays(b.endsAt, b.startsAt);
      return durationB - durationA;
    });

  if (multiDayAppointmentsInDay.length === 0) return null;

  return (
    <div className="flex border-b">
      <div className="w-18"></div>
      <div className="flex flex-1 flex-col gap-1 border-l py-1">
        {multiDayAppointmentsInDay.map((appointment) => {
          const appointmentStart = startOfDay(appointment.startsAt);
          const appointmentEnd = startOfDay(appointment.endsAt);
          const currentDate = startOfDay(selectedDate);

          const appointmentTotalDays =
            differenceInDays(appointmentEnd, appointmentStart) + 1;
          const appointmentCurrentDay =
            differenceInDays(currentDate, appointmentStart) + 1;

          return (
            <MonthEventBadge
              key={appointment.id}
              appointment={appointment}
              cellDate={selectedDate}
              appointmentTotalDays={appointmentTotalDays}
              appointmentCurrentDay={appointmentCurrentDay}
            />
          );
        })}
      </div>
    </div>
  );
}
