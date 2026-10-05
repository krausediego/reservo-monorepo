import { ContentLayout } from "@/components/content-layout";
import { useMeQuery } from "@/hooks";
import { useListProfessionalsQuery } from "@/modules/app/professionals/hooks";
import { ClientContainer } from "@/modules/app/schedule/components/client-container";
import { CalendarProvider } from "@/modules/app/schedule/contexts";
import { useListAppointmentsQuery } from "@/modules/app/schedule/hooks";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { endOfDay, startOfDay } from "date-fns";
import z from "zod";

const scheduleSearchSchema = z.object({
  view: z.literal(["day", "week", "month", "agenda"]).default("day"),
});

export const Route = createFileRoute("/_app/schedule/")({
  validateSearch: (search) => scheduleSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  const search = useSearch({ from: "/_app/schedule/" });
  const { data: me } = useMeQuery();
  const { data: professionals } = useListProfessionalsQuery({
    page: 1,
    limit: 100,
    orderBy: "desc",
  });
  const { data: appointments } = useListAppointmentsQuery({
    page: 1,
    limit: 100,
    startsAt: startOfDay(new Date()),
    endsAt: endOfDay(new Date()),
  });

  return (
    <CalendarProvider
      professionals={professionals?.data ?? []}
      appointments={appointments?.data ?? []}
      establishmentAvailability={me?.establishmentAvailabilities ?? []}
      professionalAvailability={me?.establishmentAvailabilities ?? []}
      timezone={me?.establishment?.timezone ?? ""}
    >
      <ContentLayout title="Agenda" description="Crie agendamentos">
        <ClientContainer view={search.view} />
      </ContentLayout>
    </CalendarProvider>
  );
}
