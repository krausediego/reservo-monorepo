import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_BASE_URL_API}/auth`,
});
