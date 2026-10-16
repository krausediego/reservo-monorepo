type Availability = {
  dayOfWeek: number;
  startMinutes: number;
  endMinutes: number;
  opened: boolean;
};

const DAY_LABELS = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const DAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

function minutesToTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

export function formatAvailability(
  availabilities: Availability[],
  opts: { short?: boolean } = {},
): string {
  const labels = opts.short ? DAY_SHORT : DAY_LABELS;
  const byDay = new Map(availabilities.map((a) => [a.dayOfWeek, a]));

  type Group = { days: number[]; start: number; end: number };
  const groups: Group[] = [];

  for (const day of WEEK_ORDER) {
    const a = byDay.get(day);
    if (!a?.opened) continue;

    const last = groups.at(-1);
    const prevDay = WEEK_ORDER[WEEK_ORDER.indexOf(day) - 1];
    const isConsecutive = last && last.days.at(-1) === prevDay;
    const sameHours =
      last && last.start === a.startMinutes && last.end === a.endMinutes;

    if (isConsecutive && sameHours) {
      last.days.push(day);
    } else {
      groups.push({ days: [day], start: a.startMinutes, end: a.endMinutes });
    }
  }

  if (groups.length === 0) return "Fechado";

  return groups
    .map(({ days, start, end }) => {
      const first = labels[days[0]];
      const lastLabel = labels[days.at(-1)!];
      const dayText =
        days.length === 1
          ? first
          : days.length === 2
            ? `${first} e ${lastLabel}`
            : `${first} a ${lastLabel}`;
      return `${dayText} • ${minutesToTime(start)} às ${minutesToTime(end)}`;
    })
    .join(" · ");
}
