import { SettingsContentLayout } from "@/components/settings-content-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/establishment/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SettingsContentLayout
      title="Informações sobre o estabelecimento"
      description="Atualize as informações do seu estabelecimento"
    >
      settings
    </SettingsContentLayout>
  );
}
