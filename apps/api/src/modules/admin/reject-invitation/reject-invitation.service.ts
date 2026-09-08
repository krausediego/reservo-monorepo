import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  BadRequestError,
  NotFoundError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { RejectInvitation, IRejectInvitation } from ".";

export class RejectInvitationService
  extends BaseDatabaseService
  implements IRejectInvitation
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
    params: RejectInvitation.Params,
  ): Promise<RejectInvitation.Response> {
    this.log("info", "Starting process reject-invitation");

    const hasInvitation = await this.db.invitations.findFirst({
      select: {
        id: true,
        email: true,
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
      throw new BadRequestError("Convite inexistente ou expirado");
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
      throw new NotFoundError("Usuário não encontrado");
    }

    if (params.userId !== userInvited.id) {
      this.log("warn", "You cannot accept an invitation that isn't for you.", {
        invitationUserId: userInvited.id,
        userId: params.userId,
      });
      throw new BadRequestError(
        "Você não pode aceitar um convite que não é para você.",
      );
    }

    await this.db.invitations.update({
      data: {
        status: "REJECTED",
      },
      where: {
        id: hasInvitation.id,
      },
    });

    return {
      message: "Invitation rejected!",
    };
  }
}
