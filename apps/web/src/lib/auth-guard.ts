import { redirect, type ParsedLocation } from "@tanstack/react-router";
import { authClient } from "./better-auth";
import { adminMeApi } from "@/api";

export async function loadAuthContext(location: ParsedLocation) {
  const { data: session } = await authClient.getSession();

  if (!session) {
    throw redirect({ to: "/sign-in", search: { redirect: location.href } });
  }

  const { establishment } = await adminMeApi();

  return { session, establishment };
}
