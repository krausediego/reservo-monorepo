import { useMemo } from "react";
import { isToday, startOfDay } from "date-fns";

import { cn } from "@/lib/utils";
import type { CalendarCell } from "../../types";
import { useCalendar } from "../../contexts";
import { getMonthCellEvents } from "../../helpers";
import { DroppableDayCell } from "../dnd/droppable-day-cell";
import { EventBullet } from "./event-bullet";
import { MonthEventBadge } from "./month-event-badge";
import { useRouter } from "@tanstack/react-router";
import type { IListAppointmentsSchema } from "@reservo/types";

type DayCellProps = {
  cell: CalendarCell;
  appointments: IListAppointmentsSchema.GetResponse["data"];
  appointmentPositions: Record<string, number>;
};

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({
  cell,
  appointments,
  appointmentPositions,
}: DayCellProps) {
  const { navigate } = useRouter();
  const { setSelectedDate } = useCalendar();

  const { day, currentMonth, date } = cell;

  const cellEvents = useMemo(
    () => getMonthCellEvents({ date, appointments, appointmentPositions }),
    [date, appointments, appointmentPositions],
  );
  const isSunday = date.getDay() === 0;

  const handleClick = () => {
    setSelectedDate(date);
    navigate({
      to: "/schedule",
      search: {
        view: "day",
      },
    });
  };

  return (
    <DroppableDayCell cell={cell}>
      <div
        className={cn(
          "flex h-full flex-col gap-1 border-l border-t py-1.5 lg:pb-2 lg:pt-1",
          isSunday && "border-l-0",
        )}
      >
        <button
          onClick={handleClick}
          className={cn(
            "flex size-6 translate-x-1 items-center justify-center rounded-full text-xs font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:px-2",
            !currentMonth && "opacity-20",
            isToday(date) &&
              "bg-primary font-bold text-primary-foreground hover:bg-primary",
          )}
        >
          {day}
        </button>

        <div
          className={cn(
            "flex h-6 gap-1 px-2 lg:h-23.5 lg:flex-col lg:gap-2 lg:px-0",
            !currentMonth && "opacity-50",
          )}
        >
          {[0, 1, 2].map((position) => {
            const appointment = cellEvents.find((e) => e.position === position);
            const appointmentKey = appointment
              ? `appointment-${appointment.id}-${position}`
              : `empty-${position}`;

            return (
              <div key={appointmentKey} className="lg:flex-1">
                {event && (
                  <>
                    {/** TODO: Add color */}
                    <EventBullet className="lg:hidden" color="blue" />
                    {/** TODO: This type is critical */}
                    <MonthEventBadge
                      className="hidden lg:flex"
                      appointment={
                        appointment as unknown as IListAppointmentsSchema.GetResponse["data"][number]
                      }
                      cellDate={startOfDay(date)}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {cellEvents.length > MAX_VISIBLE_EVENTS && (
          <p
            className={cn(
              "h-4.5 px-1.5 text-xs font-semibold text-muted-foreground",
              !currentMonth && "opacity-50",
            )}
          >
            <span className="sm:hidden">
              +{cellEvents.length - MAX_VISIBLE_EVENTS}
            </span>
            <span className="hidden sm:inline">
              {" "}
              {cellEvents.length - MAX_VISIBLE_EVENTS} more...
            </span>
          </p>
        )}
      </div>
    </DroppableDayCell>
  );
}
