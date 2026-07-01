import { MemberRole } from "generated/prisma/enums";

import { makeLogging } from "@/infra";
import { IMiddleware } from "@/routes/middlewares";

import { ValidateMemberRoleMiddleware } from ".";

export const makeValidateMemberRoleMiddleware = (
  role: MemberRole,
): IMiddleware => {
  return new ValidateMemberRoleMiddleware(makeLogging(), role);
};
