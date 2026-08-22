import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  IStorage,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ListMyInvitations, IListMyInvitations } from ".";

export class ListMyInvitationsService
  extends BaseDatabaseService
  implements IListMyInvitations
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
    private readonly storage: IStorage,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(
    params: ListMyInvitations.Params,
  ): Promise<ListMyInvitations.Response> {
    this.log("info", "Starting process list-my-invitations");

    const user = await this.db.users.findFirst({
      select: {
        email: true,
      },
      where: {
        id: params.userId,
      },
    });

    if (!user) {
      this.log("warn", "User not found", {
        userId: params.userId,
      });
      throw new NotFoundError("User not found");
    }

    const invitations = await this.db.invitations.findMany({
      select: {
        id: true,
        email: true,
        organizationId: true,
        role: true,
        status: true,
        expiresAt: true,
        inviterId: true,
        organizations: {
          select: {
            establishments: {
              select: {
                id: true,
                name: true,
                logoStorageKey: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      where: {
        email: user.email,
        status: "PENDING",
      },
    });

    const serializedInvitations: ListMyInvitations.Response = [];
    for (const invitation of invitations) {
      const {
        organizations: { establishments },
        users,
        ...restInvitation
      } = invitation;

      const logoSignedUrl = await this.getSignedUrl({
        key: establishments?.logoStorageKey,
      });

      serializedInvitations.push({
        establishment: {
          ...establishments!,
          logoUrl: logoSignedUrl,
        },
        inviter: {
          ...users,
        },
        ...restInvitation,
      });
    }

    return serializedInvitations;
  }

  private async getSignedUrl(
    params: ListMyInvitations.GetSignedUrlParams,
  ): Promise<string | null> {
    if (!params.key) {
      return null;
    }

    return this.storage.getSignedUrl({ key: params.key });
  }
}
