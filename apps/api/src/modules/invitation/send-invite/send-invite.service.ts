import { addDays } from "date-fns";

import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  BadRequestError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { SendInvite, ISendInvite } from ".";

export class SendInviteService
  extends BaseDatabaseService
  implements ISendInvite
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: SendInvite.Params): Promise<SendInvite.Response> {
    this.log("info", "Starting process send-invite");

    const hasUser = await this.db.users.findFirst({
      select: {
        id: true,
      },
      where: {
        email: params.email,
      },
    });

    if (!hasUser) {
      this.log("warn", "This user already member or not found", {
        email: params.email,
      });
      throw new NotFoundError("This user already member or not found");
    }

    const alreadyMember = await this.db.members.findFirst({
      select: {
        id: true,
      },
      where: {
        userId: hasUser.id,
      },
    });

    if (alreadyMember) {
      this.log("warn", "This user already member or not found", {
        memberId: alreadyMember.id,
      });
      throw new NotFoundError("This user already member or not found");
    }

    const alreadyValidInvite = await this.db.invitations.findFirst({
      select: {
        id: true,
      },
      where: {
        email: params.email,
        organizationId: params.organizationId,
        status: "PENDING",
      },
    });

    if (alreadyValidInvite) {
      this.log("warn", "This user already valid invited open", {
        email: params.email,
        invitationId: alreadyValidInvite.id,
      });
      throw new BadRequestError("This user already valid invited open");
    }

    const invitation = await this.db.invitations.create({
      select: {
        id: true,
        email: true,
        organizationId: true,
        role: true,
        status: true,
        expiresAt: true,
        inviterId: true,
      },
      data: {
        email: params.email,
        inviterId: params.userId,
        organizationId: params.organizationId,
        role: params.role,
        status: "PENDING",
        expiresAt: addDays(new Date(), 1),
      },
    });

    return {
      ...invitation,
    };
  }
}
