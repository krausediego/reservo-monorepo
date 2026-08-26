import { redirect, type ParsedLocation } from "@tanstack/react-router";
import { authClient } from "./better-auth";
import type { QueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "@/hooks";

export async function loadAuthContext(
  location: ParsedLocation,
  queryClient: QueryClient,
) {
  const { data: session } = await authClient.getSession();

  if (!session) {
    throw redirect({ to: "/sign-in", search: { redirect: location.href } });
  }

  const { establishment } = await queryClient.ensureQueryData(meQueryOptions);

  return { session, establishment };
}
