import { Database, IDatabase, ILoggingManager } from "@/infra";

import { BaseService } from ".";

export abstract class BaseDatabaseService extends BaseService {
  protected organizationId: string;

  protected userId: string;

  constructor(
    logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger);
  }

  protected get db(): Database.Response {
    return this.database.create({
      organizationId: this.organizationId,
      userId: this.userId,
    });
  }
}
