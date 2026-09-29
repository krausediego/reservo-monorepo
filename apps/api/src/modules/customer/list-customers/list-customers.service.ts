import { setTraceId, setDatabaseContext } from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ListCustomers, IListCustomers } from ".";

export class ListCustomersService extends BaseDatabaseService implements IListCustomers {
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: ListCustomers.Params): Promise<ListCustomers.Response> {
    this.log("info", "Starting process list-customers");

    return {};
  }
}
