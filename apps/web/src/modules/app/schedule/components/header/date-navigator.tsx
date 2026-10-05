import { useMemo } from "react";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CalendarView } from "../../types";
import { useCalendar } from "../../contexts";
import { getEventsCount, navigateDate, rangeText } from "../../helpers";
import type { IListAppointmentsSchema } from "@reservo/types";

type DateNavigatorProps = {
  view: CalendarView;
  appointments: IListAppointmentsSchema.GetResponse["data"];
};

export function DateNavigator({ view, appointments }: DateNavigatorProps) {
  const { selectedDate, setSelectedDate } = useCalendar();

  const month = formatDate(selectedDate, "MMMM", { locale: ptBR });
  const year = selectedDate.getFullYear();

  const eventCount = useMemo(
    () => getEventsCount({ appointments, date: selectedDate, view }),
    [appointments, selectedDate, view],
  );

  const handlePrevious = () =>
    setSelectedDate(
      navigateDate({ date: selectedDate, view, direction: "previous" }),
    );
  const handleNext = () =>
    setSelectedDate(
      navigateDate({ date: selectedDate, view, direction: "next" }),
    );

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">
          {month} {year}
        </span>
        <Badge variant="outline" className="px-1.5">
          {eventCount} agendamento(s)
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handlePrevious}
        >
          <ChevronLeft />
        </Button>

        <p className="text-sm text-muted-foreground">
          {rangeText({ view, date: selectedDate })}
        </p>

        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
