/**
 * Conversão entre minutos desde a meia-noite e "HH:mm".
 *   480  <-> "08:00"
 *   1350 <-> "22:30"
 */

const MINUTES_IN_DAY = 24 * 60;

const TIME_PATTERN = /^(\d{1,2}):([0-5]\d)$/;

export const timeToMinutes = (time: string): number | null => {
  const match = TIME_PATTERN.exec(time.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 24 || (hours === 24 && minutes > 0)) return null;

  return hours * 60 + minutes;
};
export const minutesToTime = (minutes: number): string | null => {
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > MINUTES_IN_DAY) {
    return null;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

export const parseTime = (time: string): number => {
  const value = timeToMinutes(time);
  if (value === null) throw new Error(`Horário inválido: "${time}"`);
  return value;
};

export const formatTime = (minutes: number): string => {
  const value = minutesToTime(minutes);
  if (value === null) throw new Error(`Minutos inválidos: ${minutes}`);
  return value;
};

export const durationBetween = (
  startMinutes: number,
  endMinutes: number,
): number =>
  endMinutes >= startMinutes
    ? endMinutes - startMinutes
    : MINUTES_IN_DAY - startMinutes + endMinutes;

export const timeSlots = (
  startMinutes = 0,
  endMinutes = MINUTES_IN_DAY,
  stepMinutes = 30,
): Array<{ value: number; label: string }> => {
  const slots: Array<{ value: number; label: string }> = [];

  for (let m = startMinutes; m < endMinutes; m += stepMinutes) {
    const label = minutesToTime(m);
    if (label) slots.push({ value: m, label });
  }

  return slots;
};

export const weekDayEnum = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
};
