import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
  isSameWeek,
  isSameDay,
  isSameMonth,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  format,
  differenceInMinutes,
  eachDayOfInterval,
  startOfDay,
  differenceInDays,
  isWithinInterval,
} from "date-fns";

import type {
  CalendarCell,
  CalendarView,
  VisibleHours,
  WorkingHours,
  EventColor,
  Availability,
} from "@/modules/app/schedule/types";
import { ptBR } from "date-fns/locale";
import type {
  IListAppointmentsSchema,
  IListProfessionalsSchema,
} from "@reservo/types";

export function fits({
  day,
  fromMin,
  toMin,
  hours,
}: {
  day: Date;
  fromMin: number;
  toMin: number;
  hours: Availability[];
}) {
  const dow = day.getDay();
  return hours.some(
    (h) =>
      h.opened &&
      h.dayOfWeek === dow &&
      fromMin >= h.startMinutes &&
      toMin <= h.endMinutes,
  );
}

export function isSlotAvailable({
  day,
  hour,
  minute,
  establishment,
  slot = 15,
  professional,
}: {
  day: Date;
  hour: number;
  minute: number;
  establishment: Availability[];
  professional?: Availability[];
  slot?: number;
}) {
  const fromMin = hour * 60 + minute;
  const toMin = fromMin + slot;
  if (!fits({ day, fromMin, toMin, hours: establishment })) return false;
  if (professional && !fits({ day, fromMin, toMin, hours: professional }))
    return false;
  return true;
}

export function getUnavailableRanges({
  day,
  visible,
  establishment,
  professional,
}: {
  day: Date;
  visible: { from: number; to: number };
  establishment: Availability[];
  professional?: Availability[];
}) {
  const start = visible.from * 60;
  const end = visible.to * 60;
  const ranges: { from: number; to: number }[] = [];
  let open: number | null = null;

  for (let m = start; m < end; m += 15) {
    const ok = isSlotAvailable({
      day,
      hour: Math.floor(m / 60),
      minute: m % 60,
      establishment,
      professional,
    });
    if (!ok && open === null) open = m;
    if (ok && open !== null) {
      ranges.push({ from: open, to: m });
      open = null;
    }
  }
  if (open !== null) ranges.push({ from: open, to: end });

  return ranges;
}

export function rangeText({
  view,
  date,
}: {
  view: CalendarView;
  date: Date;
}): string {
  const formatString = "d MMM, yyyy";
  let start: Date;
  let end: Date;

  switch (view) {
    case "agenda":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case "day":
      return format(date, formatString, { locale: ptBR });
    default:
      return "Erro ao formatar data";
  }

  return `${format(start, formatString, { locale: ptBR })} - ${format(end, formatString, { locale: ptBR })}`;
}

export function navigateDate({
  date,
  view,
  direction,
}: {
  date: Date;
  view: CalendarView;
  direction: "previous" | "next";
}): Date {
  const operations = {
    agenda: direction === "next" ? addMonths : subMonths,
    month: direction === "next" ? addMonths : subMonths,
    week: direction === "next" ? addWeeks : subWeeks,
    day: direction === "next" ? addDays : subDays,
  };

  return operations[view](date, 1);
}

export function getEventsCount({
  appointments,
  date,
  view,
}: {
  appointments: IListAppointmentsSchema.GetResponse["data"];
  date: Date;
  view: CalendarView;
}): number {
  const compareFns: Record<
    CalendarView,
    typeof isSameMonth | typeof isSameWeek | typeof isSameDay
  > = {
    agenda: isSameMonth,
    month: isSameMonth,
    week: isSameWeek,
    day: isSameDay,
  };

  return appointments.filter((appointment) =>
    compareFns[view](appointment.startsAt, date),
  ).length;
}

// ================ Week and day view helper functions ================ //

export function getCurrentEvents({
  appointments,
}: {
  appointments: IListAppointmentsSchema.GetResponse["data"];
}): IListAppointmentsSchema.GetResponse["data"] {
  const now = new Date();

  return (
    appointments.filter((appointment) =>
      isWithinInterval(now, {
        start: appointment.startsAt,
        end: appointment.endsAt,
      }),
    ) || null
  );
}

export function groupEvents({
  dayAppointments,
}: {
  dayAppointments: IListAppointmentsSchema.GetResponse["data"];
}): IListAppointmentsSchema.GetResponse["data"][] {
  const sortedAppointments = dayAppointments.sort(
    (a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
  );
  const groups: IListAppointmentsSchema.GetResponse["data"][] = [];

  for (const appointment of sortedAppointments) {
    const appointmentStart = appointment.startsAt;

    let placed = false;
    for (const group of groups) {
      const lastAppointmentInGroup = group[group.length - 1];
      const lastAppointmentEnd = lastAppointmentInGroup.endsAt;

      if (appointmentStart >= lastAppointmentEnd) {
        group.push(appointment);
        placed = true;
        break;
      }
    }

    if (!placed) groups.push([appointment]);
  }

  return groups;
}

export function getEventBlockStyle({
  appointment,
  day,
  groupIndex,
  groupSize,
  visibleHoursRange,
}: {
  appointment: IListAppointmentsSchema.GetResponse["data"][number];
  day: Date;
  groupIndex: number;
  groupSize: number;
  visibleHoursRange?: { from: number; to: number };
}): {
  top: string;
  width: string;
  left: string;
} {
  const startDate = appointment.startsAt;
  const dayStart = new Date(day.setHours(0, 0, 0, 0));
  const eventStart = startDate < dayStart ? dayStart : startDate;
  const startMinutes = differenceInMinutes(eventStart, dayStart);

  let top;

  if (visibleHoursRange) {
    const visibleStartMinutes = visibleHoursRange.from * 60;
    const visibleEndMinutes = visibleHoursRange.to * 60;
    const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;
    top = ((startMinutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
  } else {
    top = (startMinutes / 1440) * 100;
  }

  const width = 100 / groupSize;
  const left = groupIndex * width;

  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}

export function isWorkingHour({
  day,
  hour,
  workingHours,
}: {
  day: Date;
  hour: number;
  workingHours: WorkingHours;
}): boolean {
  const dayIndex = day.getDay() as keyof typeof workingHours;
  const dayHours = workingHours[dayIndex];

  return hour >= dayHours.from && hour < dayHours.to;
}

export function getVisibleHours({
  visibleHours,
  singleDayAppointments,
}: {
  visibleHours: VisibleHours;
  singleDayAppointments: IListAppointmentsSchema.GetResponse["data"];
}): {
  hours: number[];
  earliestEventHour: number;
  latestEventHour: number;
} {
  let earliestEventHour = visibleHours.from;
  let latestEventHour = visibleHours.to;

  singleDayAppointments.forEach((appointment) => {
    const startHour = appointment.startsAt.getHours();
    const endTime = appointment.endsAt;
    const endHour = endTime.getHours() + (endTime.getMinutes() > 0 ? 1 : 0);

    if (startHour < earliestEventHour) earliestEventHour = startHour;
    if (endHour > latestEventHour) latestEventHour = endHour;
  });

  latestEventHour = Math.min(latestEventHour, 24);

  const hours = Array.from(
    { length: latestEventHour - earliestEventHour },
    (_, i) => i + earliestEventHour,
  );

  return { hours, earliestEventHour, latestEventHour };
}

// ================ Month view helper functions ================ //

export function getCalendarCells({
  selectedDate,
}: {
  selectedDate: Date;
}): CalendarCell[] {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  const totalDays = firstDayOfMonth + daysInMonth;

  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(
      currentYear,
      currentMonth - 1,
      daysInPrevMonth - firstDayOfMonth + i + 1,
    ),
  }));

  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(currentYear, currentMonth, i + 1),
  }));

  const nextMonthCells = Array.from(
    { length: (7 - (totalDays % 7)) % 7 },
    (_, i) => ({
      day: i + 1,
      currentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i + 1),
    }),
  );

  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateMonthEventPositions({
  multiDayAppointments,
  singleDayAppointments,
  selectedDate,
}: {
  multiDayAppointments: IListAppointmentsSchema.GetResponse["data"];
  singleDayAppointments: IListAppointmentsSchema.GetResponse["data"];
  selectedDate: Date;
}): {
  [key: string]: number;
} {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const eventPositions: { [key: string]: number } = {};
  const occupiedPositions: { [key: string]: boolean[] } = {};

  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day) => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  const sortedAppointments = [
    ...multiDayAppointments.sort((a, b) => {
      const aDuration = differenceInDays(a.endsAt, a.startsAt);
      const bDuration = differenceInDays(b.endsAt, b.startsAt);
      return (
        bDuration - aDuration || a.startsAt.getTime() - b.startsAt.getTime()
      );
    }),
    ...singleDayAppointments.sort(
      (a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
    ),
  ];

  sortedAppointments.forEach((appointment) => {
    const appointmentStart = appointment.startsAt;
    const appointmentEnd = appointment.endsAt;
    const appointmentDays = eachDayOfInterval({
      start: appointmentStart < monthStart ? monthStart : appointmentStart,
      end: appointmentEnd > monthEnd ? monthEnd : appointmentEnd,
    });

    let position = -1;

    for (let i = 0; i < 3; i++) {
      if (
        appointmentDays.every((day) => {
          const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
          return dayPositions && !dayPositions[i];
        })
      ) {
        position = i;
        break;
      }
    }

    if (position !== -1) {
      appointmentDays.forEach((day) => {
        const dayKey = startOfDay(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      eventPositions[appointment.id] = position;
    }
  });

  return eventPositions;
}

export function getMonthCellEvents({
  date,
  appointments,
  appointmentPositions,
}: {
  date: Date;
  appointments: IListAppointmentsSchema.GetResponse["data"];
  appointmentPositions: Record<string, number>;
}): {
  position: number;
  isMultiDay: boolean;
  id: string;
  startsAt: Date;
  endsAt: Date;
  title: string;
  color: EventColor;
  description: string | null;
  professionalId: IListProfessionalsSchema.GetResponse["data"][number]["professional"]["id"];
}[] {
  const appointmentsForDate = appointments.filter((appointment) => {
    const appointmentStart = appointment.startsAt;
    const appointmentEnd = appointment.endsAt;
    return (
      (date >= appointmentStart && date <= appointmentEnd) ||
      isSameDay(date, appointmentStart) ||
      isSameDay(date, appointmentEnd)
    );
  });

  return appointmentsForDate
    .map((appointment) => ({
      ...appointment,
      position: appointmentPositions[appointment.id] ?? -1,
      isMultiDay: appointment.startsAt !== appointment.endsAt,
      title: "",
      color: "blue" as EventColor,
      description: appointment.notes,
    }))
    .sort((a, b) => {
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      return a.position - b.position;
    });
}
