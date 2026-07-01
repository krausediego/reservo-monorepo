import { MemberRole } from "generated/prisma/enums";

import { adaptMiddleware } from "@/routes/handlers";

import { makeValidateMemberRoleMiddleware } from ".";

export const validateRole = (role: MemberRole) =>
  adaptMiddleware(makeValidateMemberRoleMiddleware(role));
