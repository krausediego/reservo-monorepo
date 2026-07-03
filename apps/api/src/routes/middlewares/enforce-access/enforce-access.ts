import { adaptMiddleware } from "@/routes/handlers";

import { makeEnforceAccessMiddleware } from ".";

export const enforceAccess = (mode: "READ" | "WRITE") =>
  adaptMiddleware(makeEnforceAccessMiddleware(mode));
