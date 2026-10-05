"use client";

import { useDrop } from "react-dnd";

import { cn } from "@/lib/utils";
import type { CalendarCell } from "../../types";
import { useUpdateEvent } from "../../hooks";
import { ItemTypes } from "./draggable-event";
import type { IListAppointmentsSchema } from "@reservo/types";

type DroppableDayCellProps = {
  cell: CalendarCell;
  children: React.ReactNode;
};

export function DroppableDayCell({ cell, children }: DroppableDayCellProps) {
  const { updateEvent } = useUpdateEvent();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EVENT,
      drop: (item: {
        appointment: IListAppointmentsSchema.GetResponse["data"][number];
      }) => {
        const droppedAppointment = item.appointment;

        const eventStartDate = droppedAppointment.startsAt;
        // const eventEndDate = droppedAppointment.endsAt;

        // const eventDurationMs = differenceInMilliseconds(
        //   eventEndDate,
        //   eventStartDate,
        // );

        const newStartDate = new Date(cell.date);
        newStartDate.setHours(
          eventStartDate.getHours(),
          eventStartDate.getMinutes(),
          eventStartDate.getSeconds(),
          eventStartDate.getMilliseconds(),
        );
        // TODO: Review tomorrow

        // const newEndDate = new Date(newStartDate.getTime() + eventDurationMs);

        // updateEvent({
        //   ...droppedAppointment,
        //   startDate: newStartDate.toISOString(),
        //   endDate: newEndDate.toISOString(),
        // });

        return { moved: true };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [cell.date, updateEvent],
  );

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={cn(isOver && canDrop && "bg-accent/50")}
    >
      {children}
    </div>
  );
}
