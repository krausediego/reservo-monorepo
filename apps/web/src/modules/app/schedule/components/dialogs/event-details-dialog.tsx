import { format } from "date-fns";
import { Calendar, Clock, Text, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { IListAppointmentsSchema } from "@reservo/types";

type EventDetailsDialogProps = {
  appointment: IListAppointmentsSchema.GetResponse["data"][number];
  children: React.ReactNode;
};

export function EventDetailsDialog({
  appointment,
  children,
}: EventDetailsDialogProps) {
  const startDate = appointment.startsAt;
  const endDate = appointment.endsAt;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          {/**TODO: Change dialog title to customer name */}
          <DialogTitle>{appointment.status}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <User className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Responsible</p>
              {/**TODO: Change dialog title to customer name */}
              <p className="text-sm text-muted-foreground">
                {appointment.status}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Start Date</p>
              <p className="text-sm text-muted-foreground">
                {format(startDate, "MMM d, yyyy h:mm a")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">End Date</p>
              <p className="text-sm text-muted-foreground">
                {format(endDate, "MMM d, yyyy h:mm a")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Text className="mt-1 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {appointment.notes}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          {/**TODO: Add new appointment dialog */}
          {/* <EditEventDialog event={event}>
              <Button type="button" variant="outline">
                Edit
              </Button>
            </EditEventDialog> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
