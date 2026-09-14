import { SettingsContentLayout } from "@/components/settings-content-layout";
import { SettingsProfileForm } from "@/modules/app/settings/profile/components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SettingsContentLayout
      title="Informações pessoais"
      description="Gerencie suas informações pessoais"
    >
      <SettingsProfileForm />
    </SettingsContentLayout>
  );
}
