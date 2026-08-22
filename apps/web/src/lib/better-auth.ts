import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_BASE_URL_API}/auth`,
  plugins: [organizationClient()],
});
