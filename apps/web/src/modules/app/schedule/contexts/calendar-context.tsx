import type {
  Availability,
  BadgeVariant,
  IUser,
  VisibleHours,
  WorkingHours,
} from "@/modules/app/schedule/types";
import type {
  IListAppointmentsSchema,
  IListProfessionalsSchema,
} from "@reservo/types";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useListAppointmentsQuery } from "../hooks";
import { useSearch } from "@tanstack/react-router";
import { format } from "date-fns";

type CalendarContext = {
  selectedDate: Date;
  setSelectedDate: (date?: Date) => void;
  selectedUserId: IUser["id"] | "all";
  setSelectedUserId: (userId: IUser["id"] | "all") => void;
  badgeVariant: BadgeVariant;
  setBadgeVariant: (variant: BadgeVariant) => void;
  professionals: IListProfessionalsSchema.GetResponse["data"];
  workingHours: WorkingHours;
  setWorkingHours: Dispatch<SetStateAction<WorkingHours>>;
  visibleHours: VisibleHours;
  setVisibleHours: Dispatch<SetStateAction<VisibleHours>>;
  appointments: IListAppointmentsSchema.GetResponse["data"];
  establishmentAvailability: Availability[];
  professionalAvailability: Availability[];
  timezone: string;
};

const CalendarContext = createContext({} as CalendarContext);

const WORKING_HOURS = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
};

const VISIBLE_HOURS = { from: 1, to: 23 };

export function CalendarProvider({
  children,
  professionals,
  establishmentAvailability,
  professionalAvailability,
  timezone,
}: {
  children: React.ReactNode;
  professionals: IListProfessionalsSchema.GetResponse["data"];
  establishmentAvailability: Availability[];
  professionalAvailability: Availability[];
  timezone: string;
}) {
  const { view } = useSearch({ from: "/_app/schedule/" });

  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>("colored");
  const [visibleHours, setVisibleHours] = useState<VisibleHours>(VISIBLE_HOURS);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(WORKING_HOURS);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<
    | IListProfessionalsSchema.GetResponse["data"][number]["professional"]["id"]
    | "all"
  >("all");

  const { data: appointments } = useListAppointmentsQuery({
    page: 1,
    limit: 100,
    date: format(selectedDate, "yyyy-MM-dd"),
    view,
    professionals: selectedUserId === "all" ? undefined : [selectedUserId],
  });

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant,
        setBadgeVariant,
        professionals,
        visibleHours,
        setVisibleHours,
        workingHours,
        setWorkingHours,
        establishmentAvailability,
        professionalAvailability,
        appointments: appointments?.data ?? [],
        timezone,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContext {
  const context = useContext(CalendarContext);

  if (!context)
    throw new Error("useCalendar must be used within a CalendarProvider.");

  return context;
}
