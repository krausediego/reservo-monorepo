import { makeLogging } from "@/infra";
import { IMiddleware } from "@/routes/middlewares";

import { EnforceAccessMiddleware } from ".";

export const makeEnforceAccessMiddleware = (
  mode: "READ" | "WRITE",
): IMiddleware => {
  return new EnforceAccessMiddleware(makeLogging(), mode);
};
