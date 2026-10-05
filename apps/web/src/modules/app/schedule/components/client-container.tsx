"use client";

import { useMemo } from "react";
import { isSameDay } from "date-fns";
import type { CalendarView } from "../types";
import { useCalendar } from "../contexts";
import { CalendarHeader } from "./header/calendar-header";
import { DndProviderWrapper } from "./dnd/dnd-provider-wrapper";
import { CalendarDayView } from "./week-and-day-view/calendar-day-view";
import { CalendarMonthView } from "./month-view/calendar-month-view";
import { CalendarWeekView } from "./week-and-day-view/calendar-week-view";
import { CalendarAgendaView } from "./agenda-view/calendar-agenda-view";

type ClientContainerProps = {
  view: CalendarView;
};

export function ClientContainer({ view }: ClientContainerProps) {
  const { selectedDate, selectedUserId, appointments } = useCalendar();

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const eventStartDate = appointment.startsAt;
      const eventEndDate = appointment.endsAt;

      if (view === "month" || view === "agenda") {
        const monthStart = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1,
        );
        const monthEnd = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        const isInSelectedMonth =
          eventStartDate <= monthEnd && eventEndDate >= monthStart;
        const isUserMatch =
          selectedUserId === "all" ||
          appointment.professionalId === selectedUserId;
        return isInSelectedMonth && isUserMatch;
      }

      if (view === "week") {
        const dayOfWeek = selectedDate.getDay();

        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const isInSelectedWeek =
          eventStartDate <= weekEnd && eventEndDate >= weekStart;
        const isUserMatch =
          selectedUserId === "all" ||
          appointment.professionalId === selectedUserId;
        return isInSelectedWeek && isUserMatch;
      }

      if (view === "day") {
        const dayStart = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          0,
          0,
          0,
        );
        const dayEnd = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          23,
          59,
          59,
        );
        const isInSelectedDay =
          eventStartDate <= dayEnd && eventEndDate >= dayStart;
        const isUserMatch =
          selectedUserId === "all" ||
          appointment.professionalId === selectedUserId;
        return isInSelectedDay && isUserMatch;
      }
    });
  }, [selectedDate, selectedUserId, appointments, view]);

  const singleDayAppointments = filteredAppointments.filter((appointment) => {
    const startDate = appointment.startsAt;
    const endDate = appointment.endsAt;
    return isSameDay(startDate, endDate);
  });

  const multiDayAppointments = filteredAppointments.filter((appointment) => {
    const startDate = appointment.startsAt;
    const endDate = appointment.endsAt;
    return !isSameDay(startDate, endDate);
  });

  return (
    <div className="w-full overflow-hidden rounded-xl border">
      <CalendarHeader view={view} appointments={filteredAppointments} />

      <DndProviderWrapper>
        {view === "day" && (
          <CalendarDayView
            singleDayAppointments={singleDayAppointments}
            multiDayAppointments={multiDayAppointments}
          />
        )}
        {view === "month" && (
          <CalendarMonthView
            singleDayAppointments={singleDayAppointments}
            multiDayAppointments={multiDayAppointments}
          />
        )}
        {view === "week" && (
          <CalendarWeekView
            singleDayAppointments={singleDayAppointments}
            multiDayAppointments={multiDayAppointments}
          />
        )}
        {view === "agenda" && (
          <CalendarAgendaView
            singleDayAppointments={singleDayAppointments}
            multiDayAppointments={multiDayAppointments}
          />
        )}
      </DndProviderWrapper>
    </div>
  );
}
