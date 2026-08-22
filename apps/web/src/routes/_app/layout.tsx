import { loadAuthContext } from "@/lib/auth-guard";
import {
  createFileRoute,
  isRedirect,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    try {
      const { session, establishment } = await loadAuthContext(location);

      if (!establishment) throw redirect({ to: "/onboarding" });

      return { ...session };
    } catch (error) {
      if (isRedirect(error)) throw error;

      throw redirect({
        to: "/sign-in",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
