import { makeLogging } from "@/infra";

import { EnforceLimitMiddleware, LimitMiddleware } from ".";

export const makeEnforceLimitMiddleware = (key: LimitMiddleware.LimitKey) => {
  return new EnforceLimitMiddleware(makeLogging(), key);
};
