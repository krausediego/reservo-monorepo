/* eslint-disable no-useless-assignment */
/* eslint-disable react-hooks/preserve-manual-memoization */
import { useMemo } from "react";
import {
  startOfDay,
  startOfWeek,
  endOfWeek,
  addDays,
  differenceInDays,
  isBefore,
  isAfter,
} from "date-fns";
import { MonthEventBadge } from "../month-view/month-event-badge";
import type { IListAppointmentsSchema } from "@reservo/types";

type WeekViewMultiDayEventsRowProps = {
  selectedDate: Date;
  multiDayAppointments: IListAppointmentsSchema.GetResponse["data"];
};

export function WeekViewMultiDayEventsRow({
  selectedDate,
  multiDayAppointments,
}: WeekViewMultiDayEventsRowProps) {
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const processedEvents = useMemo(() => {
    return multiDayAppointments
      .map((appointment) => {
        const start = appointment.startsAt;
        const end = appointment.endsAt;
        const adjustedStart = isBefore(start, weekStart) ? weekStart : start;
        const adjustedEnd = isAfter(end, weekEnd) ? weekEnd : end;
        const startIndex = differenceInDays(adjustedStart, weekStart);
        const endIndex = differenceInDays(adjustedEnd, weekStart);

        return {
          ...appointment,
          adjustedStart,
          adjustedEnd,
          startIndex,
          endIndex,
        };
      })
      .sort((a, b) => {
        const startDiff = a.adjustedStart.getTime() - b.adjustedStart.getTime();
        if (startDiff !== 0) return startDiff;
        return b.endIndex - b.startIndex - (a.endIndex - a.startIndex);
      });
  }, [multiDayAppointments, weekStart, weekEnd]);

  const appointmentRows = useMemo(() => {
    const rows: (typeof processedEvents)[] = [];

    processedEvents.forEach((event) => {
      let rowIndex = rows.findIndex((row) =>
        row.every(
          (e) => e.endIndex < event.startIndex || e.startIndex > event.endIndex,
        ),
      );

      if (rowIndex === -1) {
        rowIndex = rows.length;
        rows.push([]);
      }

      rows[rowIndex].push(event);
    });

    return rows;
  }, [processedEvents]);

  const hasEventsInWeek = useMemo(() => {
    return multiDayAppointments.some((appointment) => {
      const start = appointment.startsAt;
      const end = appointment.endsAt;

      return (
        // Event starts within the week
        (start >= weekStart && start <= weekEnd) ||
        // Event ends within the week
        (end >= weekStart && end <= weekEnd) ||
        // Event spans the entire week
        (start <= weekStart && end >= weekEnd)
      );
    });
  }, [multiDayAppointments, weekStart, weekEnd]);

  if (!hasEventsInWeek) {
    return null;
  }

  return (
    <div className="hidden overflow-hidden sm:flex">
      <div className="w-18 border-b"></div>
      <div className="grid flex-1 grid-cols-7 divide-x border-b border-l">
        {weekDays.map((day, dayIndex) => (
          <div
            key={day.toISOString()}
            className="flex h-full flex-col gap-1 py-1"
          >
            {appointmentRows.map((row, rowIndex) => {
              const appointment = row.find(
                (e) => e.startIndex <= dayIndex && e.endIndex >= dayIndex,
              );

              if (!appointment) {
                return (
                  <div key={`${rowIndex}-${dayIndex}`} className="h-6.5" />
                );
              }

              let position: "first" | "middle" | "last" | "none" = "none";

              if (
                dayIndex === appointment.startIndex &&
                dayIndex === appointment.endIndex
              ) {
                position = "none";
              } else if (dayIndex === appointment.startIndex) {
                position = "first";
              } else if (dayIndex === appointment.endIndex) {
                position = "last";
              } else {
                position = "middle";
              }

              return (
                <MonthEventBadge
                  key={`${appointment.id}-${dayIndex}`}
                  appointment={appointment}
                  cellDate={startOfDay(day)}
                  position={position}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
