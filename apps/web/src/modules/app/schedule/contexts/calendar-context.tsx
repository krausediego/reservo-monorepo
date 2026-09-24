import type {
  BadgeVariant,
  IEvent,
  IUser,
  VisibleHours,
  WorkingHours,
} from "@/modules/app/schedule/types";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type CalendarContext = {
  selectedDate: Date;
  setSelectedDate: (date?: Date) => void;
  selectedUserId: IUser["id"] | "all";
  setSelectedUserId: (userId: IUser["id"] | "all") => void;
  badgeVariant: BadgeVariant;
  setBadgeVariant: (variant: BadgeVariant) => void;
  users: IUser[];
  workingHours: WorkingHours;
  setWorkingHours: Dispatch<SetStateAction<WorkingHours>>;
  visibleHours: VisibleHours;
  setVisibleHours: Dispatch<SetStateAction<VisibleHours>>;
  events: IEvent[];
  setLocalEvents: Dispatch<SetStateAction<IEvent[]>>;
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

const VISIBLE_HOURS = { from: 7, to: 18 };

export function CalendarProvider({
  children,
  users,
  events,
}: {
  children: React.ReactNode;
  users: IUser[];
  events: IEvent[];
}) {
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>("colored");
  const [visibleHours, setVisibleHours] = useState<VisibleHours>(VISIBLE_HOURS);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(WORKING_HOURS);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<IUser["id"] | "all">(
    "all",
  );

  // This localEvents doesn't need to exists in a real scenario.
  // It's used here just to simulate the update of the events.
  // In a real scenario, the events would be updated in the backend
  // and the request that fetches the events should be refetched
  const [localEvents, setLocalEvents] = useState<IEvent[]>(events);

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
        users,
        visibleHours,
        setVisibleHours,
        workingHours,
        setWorkingHours,
        // If you go to the refetch approach, you can remove the localEvents and pass the events directly
        events: localEvents,
        setLocalEvents,
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
