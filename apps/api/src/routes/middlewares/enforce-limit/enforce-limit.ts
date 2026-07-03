import { adaptMiddleware } from "@/routes/handlers";

import { LimitMiddleware, makeEnforceLimitMiddleware } from ".";

export const enforceLimit = (key: LimitMiddleware.LimitKey) =>
  adaptMiddleware(makeEnforceLimitMiddleware(key));
