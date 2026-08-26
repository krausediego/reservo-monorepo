import { loadAuthContext } from "@/lib/auth-guard";
import {
  createFileRoute,
  isRedirect,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_onboarding")({
  beforeLoad: async ({ context, location }) => {
    try {
      const { session, establishment } = await loadAuthContext(
        location,
        context.queryClient,
      );

      if (establishment) throw redirect({ to: "/dashboard" });

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
    <div className="w-full min-h-screen flex">
      <Outlet />
    </div>
  );
}
