import { AppSidebarLayout } from "@/components/app-sidebar";
import { loadAuthContext } from "@/lib/auth-guard";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, location }) => {
    const { session, establishment } = await loadAuthContext(
      location,
      context.queryClient,
    );

    if (!establishment) throw redirect({ to: "/onboarding" });

    return { ...session };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppSidebarLayout>
      <Outlet />
    </AppSidebarLayout>
  );
}
