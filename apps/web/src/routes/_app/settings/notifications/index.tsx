import { SettingsContentLayout } from "@/components/settings-content-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/notifications/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SettingsContentLayout
      title="Central de notificações"
      description="Visualize suas notificações"
    >
      Notifications
    </SettingsContentLayout>
  );
}
