import { adaptMiddleware } from "@/routes/handlers";

import { makeAuthAdminMiddleware } from "./auth-admin-factory";

export const authAdmin = adaptMiddleware(makeAuthAdminMiddleware());
