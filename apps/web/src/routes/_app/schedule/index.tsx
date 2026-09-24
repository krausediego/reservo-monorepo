import { ContentLayout } from "@/components/content-layout";
import { listEventsApi, listUsersApi } from "@/modules/app/schedule/api";
import { ClientContainer } from "@/modules/app/schedule/components/client-container";
import { CalendarProvider } from "@/modules/app/schedule/contexts";
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
const users = await listUsersApi();

function RouteComponent() {
  const search = useSearch({ from: "/_app/schedule/" });

  return (
    <CalendarProvider users={users} events={events}>
      <ContentLayout title="Agenda" description="Crie agendamentos">
        <ClientContainer view={search.view} />
      </ContentLayout>
    </CalendarProvider>
  );
}
