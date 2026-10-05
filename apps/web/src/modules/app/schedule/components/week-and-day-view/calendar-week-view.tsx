import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  areIntervalsOverlapping,
} from "date-fns";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { useCalendar } from "../../contexts";
import {
  getEventBlockStyle,
  getVisibleHours,
  groupEvents,
  isWorkingHour,
} from "../../helpers";
import { WeekViewMultiDayEventsRow } from "./week-view-multi-day-events-row";
import { EventBlock } from "./event-block";
import { CalendarTimeline } from "./calendar-time-line";
import type { IListAppointmentsSchema } from "@reservo/types";

type CalendarWeekViewProps = {
  singleDayAppointments: IListAppointmentsSchema.GetResponse["data"];
  multiDayAppointments: IListAppointmentsSchema.GetResponse["data"];
};

export function CalendarWeekView({
  singleDayAppointments,
  multiDayAppointments,
}: CalendarWeekViewProps) {
  const { selectedDate, workingHours, visibleHours } = useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours({
    visibleHours,
    singleDayAppointments,
  });

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <>
      <div className="flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden">
        <p>Weekly view is not available on smaller devices.</p>
        <p>Please switch to daily or monthly view.</p>
      </div>

      <div className="hidden flex-col sm:flex">
        <div>
          <WeekViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayAppointments={multiDayAppointments}
          />

          {/* Week header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <div className="grid flex-1 grid-cols-7 divide-x border-l">
              {weekDays.map((day, index) => (
                <span
                  key={index}
                  className="py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {format(day, "EE")}{" "}
                  <span className="ml-1 font-semibold text-foreground">
                    {format(day, "d")}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="h-184" type="always">
          <div className="flex overflow-hidden">
            {/* Hours column */}
            <div className="relative w-18">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: "96px" }}>
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date().setHours(hour, 0, 0, 0), "hh a")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Week grid */}
            <div className="relative flex-1 border-l">
              <div className="grid grid-cols-7 divide-x">
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = singleDayAppointments.filter(
                    (appointment) =>
                      isSameDay(appointment.startsAt, day) ||
                      isSameDay(appointment.endsAt, day),
                  );
                  const groupedEvents = groupEvents({ dayAppointments });

                  return (
                    <div key={dayIndex} className="relative">
                      {hours.map((hour, index) => {
                        const isDisabled = !isWorkingHour({
                          day,
                          hour,
                          workingHours,
                        });

                        return (
                          <div
                            key={hour}
                            className={cn(
                              "relative",
                              isDisabled && "bg-calendar-disabled-hour",
                            )}
                            style={{ height: "96px" }}
                          >
                            {index !== 0 && (
                              <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                            )}

                            {/* <DroppableTimeBlock
                              date={day}
                              hour={hour}
                              minute={0}
                            >
                              <AddEventDialog
                                startDate={day}
                                startTime={{ hour, minute: 0 }}
                              >
                                <div className="absolute inset-x-0 top-0 h-6 cursor-pointer transition-colors hover:bg-accent" />
                              </AddEventDialog>
                            </DroppableTimeBlock>

                            <DroppableTimeBlock
                              date={day}
                              hour={hour}
                              minute={15}
                            >
                              <AddEventDialog
                                startDate={day}
                                startTime={{ hour, minute: 15 }}
                              >
                                <div className="absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                              </AddEventDialog>
                            </DroppableTimeBlock>

                            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                            <DroppableTimeBlock
                              date={day}
                              hour={hour}
                              minute={30}
                            >
                              <AddEventDialog
                                startDate={day}
                                startTime={{ hour, minute: 30 }}
                              >
                                <div className="absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                              </AddEventDialog>
                            </DroppableTimeBlock>

                            <DroppableTimeBlock
                              date={day}
                              hour={hour}
                              minute={45}
                            >
                              <AddEventDialog
                                startDate={day}
                                startTime={{ hour, minute: 45 }}
                              >
                                <div className="absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent" />
                              </AddEventDialog>
                            </DroppableTimeBlock> */}
                          </div>
                        );
                      })}

                      {groupedEvents.map((group, groupIndex) =>
                        group.map((appointment) => {
                          let style = getEventBlockStyle({
                            appointment,
                            day,
                            groupIndex,
                            groupSize: groupedEvents.length,
                            visibleHoursRange: {
                              from: earliestEventHour,
                              to: latestEventHour,
                            },
                          });
                          const hasOverlap = groupedEvents.some(
                            (otherGroup, otherIndex) =>
                              otherIndex !== groupIndex &&
                              otherGroup.some((otherAppointment) =>
                                areIntervalsOverlapping(
                                  {
                                    start: appointment.startsAt,
                                    end: appointment.endsAt,
                                  },
                                  {
                                    start: otherAppointment.startsAt,
                                    end: otherAppointment.endsAt,
                                  },
                                ),
                              ),
                          );

                          if (!hasOverlap)
                            style = { ...style, width: "100%", left: "0%" };

                          return (
                            <div
                              key={appointment.id}
                              className="absolute p-1"
                              style={style}
                            >
                              <EventBlock appointment={appointment} />
                            </div>
                          );
                        }),
                      )}
                    </div>
                  );
                })}
              </div>

              <CalendarTimeline
                firstVisibleHour={earliestEventHour}
                lastVisibleHour={latestEventHour}
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
