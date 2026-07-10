import { setTraceId, setDatabaseContext } from "@/helpers";
import {
  type ILoggingManager,
  type IDatabase,
  type IStorage,
  NotFoundError,
} from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { GetProfessional, IGetProfessional } from ".";

export class GetProfessionalService
  extends BaseDatabaseService
  implements IGetProfessional
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
  async run(params: GetProfessional.Params): Promise<GetProfessional.Response> {
    this.log("info", "Starting process get-professional");

    const professional = await this.db.professionals.findFirst({
      where: {
        id: params.id,
        isActive: true,
      },
    });

    if (!professional) {
      this.log("warn", "Professional not found", {
        id: params.id,
      });
      throw new NotFoundError("Professional not found");
    }

    const avatarUrl =
      professional?.avatarStorageKey &&
      (await this.storage.getSignedUrl({ key: professional.avatarStorageKey }));

    return {
      professional: {
        ...professional,
        avatarUrl,
      },
    };
  }
}
