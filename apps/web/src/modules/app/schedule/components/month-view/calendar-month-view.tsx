import { useMemo } from "react";
import { useCalendar } from "../../contexts";
import { calculateMonthEventPositions, getCalendarCells } from "../../helpers";
import { DayCell } from "./day-cell";
import type { IListAppointmentsSchema } from "@reservo/types";

type CalendarMonthViewProps = {
  singleDayAppointments: IListAppointmentsSchema.GetResponse["data"];
  multiDayAppointments: IListAppointmentsSchema.GetResponse["data"];
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarMonthView({
  singleDayAppointments,
  multiDayAppointments,
}: CalendarMonthViewProps) {
  const { selectedDate } = useCalendar();

  const allAppointments = [...multiDayAppointments, ...singleDayAppointments];

  const cells = useMemo(
    () => getCalendarCells({ selectedDate }),
    [selectedDate],
  );

  const appointmentPositions = useMemo(
    () =>
      calculateMonthEventPositions({
        multiDayAppointments,
        singleDayAppointments,
        selectedDate,
      }),
    [multiDayAppointments, singleDayAppointments, selectedDate],
  );

  return (
    <div>
      <div className="grid grid-cols-7 divide-x">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="flex items-center justify-center py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 overflow-hidden">
        {cells.map((cell) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            appointments={allAppointments}
            appointmentPositions={appointmentPositions}
          />
        ))}
      </div>
    </div>
  );
}
