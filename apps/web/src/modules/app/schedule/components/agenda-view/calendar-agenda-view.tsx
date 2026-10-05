import { useMemo } from "react";
import { CalendarX2 } from "lucide-react";
import { format, endOfDay, startOfDay, isSameMonth } from "date-fns";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalendar } from "../../contexts";
import { AgendaDayGroup } from "./agenda-day-group";
import type { IListAppointmentsSchema } from "@reservo/types";

type CalendarAgendaViewProps = {
  singleDayAppointments: IListAppointmentsSchema.GetResponse["data"];
  multiDayAppointments: IListAppointmentsSchema.GetResponse["data"];
};

export function CalendarAgendaView({
  singleDayAppointments,
  multiDayAppointments,
}: CalendarAgendaViewProps) {
  const { selectedDate } = useCalendar();

  const eventsByDay = useMemo(() => {
    const allDates = new Map<
      string,
      {
        date: Date;
        appointments: IListAppointmentsSchema.GetResponse["data"];
        multiDayAppointments: IListAppointmentsSchema.GetResponse["data"];
      }
    >();

    singleDayAppointments.forEach((appointment) => {
      const eventDate = appointment.startsAt;
      if (!isSameMonth(eventDate, selectedDate)) return;

      const dateKey = format(eventDate, "yyyy-MM-dd");

      if (!allDates.has(dateKey)) {
        allDates.set(dateKey, {
          date: startOfDay(eventDate),
          appointments: [],
          multiDayAppointments: [],
        });
      }

      allDates.get(dateKey)?.appointments.push(appointment);
    });

    multiDayAppointments.forEach((appointment) => {
      const appointmentStart = appointment.startsAt;
      const appointmentEnd = appointment.endsAt;

      let currentDate = startOfDay(appointmentStart);
      const lastDate = endOfDay(appointmentEnd);

      while (currentDate <= lastDate) {
        if (isSameMonth(currentDate, selectedDate)) {
          const dateKey = format(currentDate, "yyyy-MM-dd");

          if (!allDates.has(dateKey)) {
            allDates.set(dateKey, {
              date: new Date(currentDate),
              appointments: [],
              multiDayAppointments: [],
            });
          }

          allDates.get(dateKey)?.multiDayAppointments.push(appointment);
        }
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
    });

    return Array.from(allDates.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }, [singleDayAppointments, multiDayAppointments, selectedDate]);

  const hasAnyEvents =
    singleDayAppointments.length > 0 || multiDayAppointments.length > 0;

  return (
    <div className="h-200">
      <ScrollArea className="h-full" type="always">
        <div className="space-y-6 p-4">
          {eventsByDay.map((dayGroup) => (
            <AgendaDayGroup
              key={format(dayGroup.date, "yyyy-MM-dd")}
              date={dayGroup.date}
              appointments={dayGroup.appointments}
              multiDayAppointments={dayGroup.multiDayAppointments}
            />
          ))}

          {!hasAnyEvents && (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
              <CalendarX2 className="size-10" />
              <p className="text-sm md:text-base">
                No events scheduled for the selected month
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
