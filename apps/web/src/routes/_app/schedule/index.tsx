import { ContentLayout } from "@/components/content-layout";
import { useMeQuery } from "@/hooks";
import { useListProfessionalsQuery } from "@/modules/app/professionals/hooks";
import { listEventsApi, listUsersApi } from "@/modules/app/schedule/api";
import { ClientContainer } from "@/modules/app/schedule/components/client-container";
import { CalendarProvider } from "@/modules/app/schedule/contexts";
import { useListUsersQuery } from "@/modules/app/users/hooks";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import z from "zod";

const scheduleSearchSchema = z.object({
  view: z.literal(["day", "week", "month", "agenda"]).default("day"),
});

export const Route = createFileRoute("/_app/schedule/")({
  validateSearch: (search) => scheduleSearchSchema.parse(search),
  component: RouteComponent,
});

const events = await listEventsApi();

function RouteComponent() {
  const search = useSearch({ from: "/_app/schedule/" });
  const { data: me } = useMeQuery();
  const { data: professionals } = useListProfessionalsQuery({
    page: 1,
    limit: 100,
    orderBy: "desc",
  });

  return (
    <CalendarProvider
      professionals={professionals?.data ?? []}
      events={events}
      establishmentAvailability={me?.establishmentAvailabilities ?? []}
      professionalAvailability={me?.establishmentAvailabilities ?? []}
    >
      <ContentLayout title="Agenda" description="Crie agendamentos">
        <ClientContainer view={search.view} />
      </ContentLayout>
    </CalendarProvider>
  );
}
