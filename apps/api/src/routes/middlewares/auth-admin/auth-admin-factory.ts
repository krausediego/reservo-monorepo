import { makeLogging } from "@/infra";
import { IMiddleware } from "@/routes/middlewares";

import { AuthAdminMiddleware } from "./auth-admin-middleware";

export const makeAuthAdminMiddleware = (): IMiddleware => {
  return new AuthAdminMiddleware(makeLogging());
};
