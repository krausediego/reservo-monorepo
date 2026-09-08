import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  NotFoundError,
  IStorage,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { Me, IMe } from ".";

export class MeService extends BaseDatabaseService implements IMe {
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
    private readonly storage: IStorage,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: Me.Params): Promise<Me.Response> {
    this.log("info", "Starting process me");

    const hasUser = await this.db.users.findFirst({
      where: {
        id: params.userId,
      },
      include: {
        members: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!hasUser) {
      this.log("warn", "User not found", {
        id: params.userId,
      });
      throw new NotFoundError("Usuário não encontrado");
    }

    const { members, ...user } = hasUser;

    if (!members.length) {
      return {
        user,
        establishment: null,
      };
    }

    const hasEstablishment = await this.db.establishments.findFirst({
      where: {
        organizationId: members[0]?.organizationId,
      },
    });

    if (!hasEstablishment) {
      this.log("warn", "Establishment not found.", {
        organizationId: members[0]?.organizationId,
      });
      throw new NotFoundError("Estabelecimento não encontrado");
    }

    const {
      logoStorageKey,
      coverStorageKey,
      latitude,
      longitude,
      ...establishment
    } = hasEstablishment;

    const logoSignedUrl = await this.getSignedUrl({ key: logoStorageKey });
    const coverSignedUrl = await this.getSignedUrl({ key: coverStorageKey });

    return {
      user,
      establishment: {
        ...establishment,
        latitude: latitude.toNumber(),
        longitude: longitude.toNumber(),
        logoUrl: logoSignedUrl,
        coverUrl: coverSignedUrl,
      },
    };
  }

  private async getSignedUrl(
    params: Me.GetSignedUrlParams,
  ): Promise<string | null> {
    if (!params.key) {
      return null;
    }

    return this.storage.getSignedUrl({ key: params.key });
  }
}
