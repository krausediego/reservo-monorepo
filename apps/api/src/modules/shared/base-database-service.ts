import { Database, IDatabase, ILoggingManager } from "@/infra";

import { BaseService } from ".";

export abstract class BaseDatabaseService extends BaseService {
  protected establishmentId: string;

  protected userId: string;

  constructor(
    logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger);
  }

  protected get db(): Database.Response {
    return this.database.create({
      establishmentId: this.establishmentId,
      userId: this.userId,
    });
  }
}
