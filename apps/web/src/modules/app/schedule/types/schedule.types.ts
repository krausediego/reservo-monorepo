export type CalendarView = "day" | "week" | "month" | "agenda";

export type EventColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange"
  | "gray";

export type BadgeVariant = "dot" | "colored" | "mixed";

export type WorkingHours = {
  [key: number]: {
    from: number;
    to: number;
  };
};

export type VisibleHours = {
  from: number;
  to: number;
};

export type IUser = {
  id: string;
  name: string;
  picturePath: string | null;
};

export type IEvent = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  color: EventColor;
  description: string;
  user: IUser;
};

export type CalendarCell = {
  day: number;
  currentMonth: boolean;
  date: Date;
};
