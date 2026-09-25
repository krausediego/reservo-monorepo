import { toZonedTime } from "date-fns-tz";

type WorkingHour = {
  dayOfWeek: number; // 0 = domingo, igual ao getDay()
  startMinutes: number;
  endMinutes: number;
  opened: boolean;
};

function toLocalSlot(date: Date, timezone: string) {
  const local = toZonedTime(date, timezone);
  return {
    dayOfWeek: local.getDay(),
    minutes: local.getHours() * 60 + local.getMinutes(),
    dateKey: local.toDateString(), // pra garantir que início e fim são no mesmo dia
  };
}

export function isWithinWorkingHours({
  startsAt,
  endsAt,
  timezone,
  hours,
}: {
  startsAt: Date;
  endsAt: Date;
  timezone: string;
  hours: WorkingHour[];
}): boolean {
  const start = toLocalSlot(startsAt, timezone);
  const end = toLocalSlot(endsAt, timezone);

  // atendimento que atravessa a meia-noite não é suportado por esse modelo
  if (start.dateKey !== end.dateKey) {
    return false;
  }

  // pode haver mais de um intervalo no mesmo dia (manhã / tarde, com almoço no meio)
  return hours.some(
    (h) =>
      h.opened &&
      h.dayOfWeek === start.dayOfWeek &&
      start.minutes >= h.startMinutes &&
      end.minutes <= h.endMinutes,
  );
}
