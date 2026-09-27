"use client";

import { useDrop } from "react-dnd";
import {
  parseISO,
  differenceInMilliseconds,
  differenceInMinutes,
} from "date-fns";

import { cn } from "@/lib/utils";
import { useUpdateEvent } from "../../hooks";
import { ItemTypes } from "./draggable-event";
import type { IEvent } from "../../types";
import { fits } from "../../helpers";
import { useCalendar } from "../../contexts";

type DroppableTimeBlockProps = {
  date: Date;
  hour: number;
  minute: number;
  children: React.ReactNode;
};

export function DroppableTimeBlock({
  date,
  hour,
  minute,
  children,
}: DroppableTimeBlockProps) {
  const { updateEvent } = useUpdateEvent();
  const { establishmentAvailability, professionalAvailability } = useCalendar();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EVENT,
      drop: (item: { event: IEvent }) => {
        const droppedEvent = item.event;

        const eventStartDate = parseISO(droppedEvent.startDate);
        const eventEndDate = parseISO(droppedEvent.endDate);

        const eventDurationMs = differenceInMilliseconds(
          eventEndDate,
          eventStartDate,
        );

        const newStartDate = new Date(date);
        newStartDate.setHours(hour, minute, 0, 0);
        const newEndDate = new Date(newStartDate.getTime() + eventDurationMs);

        updateEvent({
          ...droppedEvent,
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
        });

        return { moved: true };
      },
      canDrop: (item) => {
        const duration = differenceInMinutes(
          parseISO(item.event.endDate),
          parseISO(item.event.startDate),
        );
        const from = hour * 60 * minute;

        return (
          fits({
            day: date,
            fromMin: from,
            toMin: from + duration,
            hours: establishmentAvailability,
          }) &&
          (!professionalAvailability ||
            fits({
              day: date,
              fromMin: from,
              toMin: from + duration,
              hours: professionalAvailability,
            }))
        );
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [date, hour, minute, updateEvent],
  );

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={cn("h-6", isOver && canDrop && "bg-accent/50")}
    >
      {children}
    </div>
  );
}
