import { ContentLayout } from "@/components/content-layout";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { Separator } from "@/components/ui/separator";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentLayout
      title="Configurações"
      description="Gerencie seu perfil e configurações do sistema"
    >
      <div className="w-full flex flex-col lg:flex-row gap-10">
        <SettingsSidebar />
        <Separator className="lg:hidden" />
        <Outlet />
      </div>
    </ContentLayout>
  );
}
