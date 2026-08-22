import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  BadRequestError,
  NotFoundError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { AcceptInvitation, IAcceptInvitation } from ".";

export class AcceptInvitationService
  extends BaseDatabaseService
  implements IAcceptInvitation
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(
    params: AcceptInvitation.Params,
  ): Promise<AcceptInvitation.Response> {
    this.log("info", "Starting process accept-invitation");

    const hasInvitation = await this.db.invitations.findFirst({
      select: {
        id: true,
        email: true,
        organizationId: true,
        role: true,
      },
      where: {
        id: params.id,
        status: "PENDING",
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!hasInvitation) {
      this.log("warn", "Invitation not found or expired.", {
        invitationId: params.id,
      });
      throw new BadRequestError("Invitation not found or expired.");
    }

    const userInvited = await this.db.users.findFirst({
      select: {
        id: true,
      },
      where: {
        email: hasInvitation.email,
      },
    });

    if (!userInvited) {
      this.log("warn", "User not found", {
        email: hasInvitation.email,
      });
      throw new NotFoundError("User not found");
    }

    if (params.userId !== userInvited.id) {
      this.log("warn", "You cannot accept an invitation that isn't for you.", {
        invitationUserId: userInvited.id,
        userId: params.userId,
      });
      throw new BadRequestError(
        "You cannot accept an invitation that isn't for you.",
      );
    }

    await this.db.$transaction(async (tx) => {
      await tx.invitations.update({
        data: {
          status: "ACCEPTED",
        },
        where: {
          id: hasInvitation.id,
        },
      });

      await tx.members.create({
        data: {
          userId: userInvited.id,
          organizationId: hasInvitation.organizationId,
          role: hasInvitation.role,
        },
      });

      await tx.sessions.update({
        data: {
          activeOrganizationId: hasInvitation.organizationId,
        },
        where: {
          token: params.token,
        },
      });
    });

    return {
      message: "Invitation accepted!",
    };
  }
}
