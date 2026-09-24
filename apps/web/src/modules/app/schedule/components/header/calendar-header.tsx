import { Columns, List, Plus, Grid2x2, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CalendarView, IEvent } from "../../types";
import { TodayButton } from "./today-button";
import { DateNavigator } from "./date-navigator";
import { UserSelect } from "./user-select";
import { useNavigate } from "@tanstack/react-router";

type CalendarHeaderProps = {
  view: CalendarView;
  events: IEvent[];
};

export function CalendarHeader({ view, events }: CalendarHeaderProps) {
  const navigate = useNavigate();

  const handleChangeView = (view: CalendarView) => {
    navigate({
      to: "/schedule",
      search: (prev) => ({
        ...prev,
        view,
      }),
    });
  };

  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
        <div className="flex w-full items-center gap-1.5">
          <div className="inline-flex first:rounded-r-none last:rounded-l-none [&:not(:first-child):not(:last-child)]:rounded-none">
            <Button
              aria-label="View by day"
              size="icon"
              variant={view === "day" ? "default" : "outline"}
              className="rounded-r-none"
              onClick={() => handleChangeView("day")}
            >
              <List strokeWidth={1.8} className="size-5" />
            </Button>

            <Button
              aria-label="View by week"
              size="icon"
              variant={view === "week" ? "default" : "outline"}
              className="-ml-px rounded-none"
              onClick={() => handleChangeView("week")}
            >
              <Columns strokeWidth={1.8} className="size-5" />
            </Button>

            <Button
              aria-label="View by month"
              size="icon"
              variant={view === "month" ? "default" : "outline"}
              className="-ml-px rounded-none"
              onClick={() => handleChangeView("month")}
            >
              <Grid2x2 strokeWidth={1.8} className="size-5" />
            </Button>

            <Button
              aria-label="View by agenda"
              size="icon"
              variant={view === "agenda" ? "default" : "outline"}
              className="-ml-px rounded-l-none"
              onClick={() => handleChangeView("agenda")}
            >
              <CalendarRange strokeWidth={1.8} className="size-5" />
            </Button>
          </div>

          <UserSelect />
        </div>

        {/* <AddEventDialog> */}
        <Button className="w-full sm:w-auto">
          <Plus />
          Add Event
        </Button>
        {/* </AddEventDialog> */}
      </div>
    </div>
  );
}
