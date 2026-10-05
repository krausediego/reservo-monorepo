import { differenceInDays, format, startOfDay } from "date-fns";
import { AgendaEventCard } from "./agenda-event-card";
import type { IListAppointmentsSchema } from "@reservo/types";

type AgendaDayGroup = {
  date: Date;
  appointments: IListAppointmentsSchema.GetResponse["data"];
  multiDayAppointments: IListAppointmentsSchema.GetResponse["data"];
};

export function AgendaDayGroup({
  date,
  appointments,
  multiDayAppointments,
}: AgendaDayGroup) {
  const sortedAppointments = [...appointments].sort(
    (a, b) => a.startsAt.getTime() - b.endsAt.getTime(),
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-0 flex items-center gap-4 bg-background py-2">
        <p className="text-sm font-semibold">
          {format(date, "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <div className="space-y-2">
        {multiDayAppointments.length > 0 &&
          multiDayAppointments.map((appointment) => {
            const appointmentStart = startOfDay(appointment.startsAt);
            const appointmentEnd = startOfDay(appointment.endsAt);
            const currentDate = startOfDay(date);

            const appointmentTotalDays =
              differenceInDays(appointmentEnd, appointmentStart) + 1;
            const appointmentCurrentDay =
              differenceInDays(currentDate, appointmentStart) + 1;
            return (
              <AgendaEventCard
                key={appointment.id}
                appointment={appointment}
                appointmentCurrentDay={appointmentCurrentDay}
                appointmentTotalDays={appointmentTotalDays}
              />
            );
          })}

        {sortedAppointments.length > 0 &&
          sortedAppointments.map((appointment) => (
            <AgendaEventCard key={appointment.id} appointment={appointment} />
          ))}
      </div>
    </div>
  );
}
