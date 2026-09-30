import { CustomersWhereInput } from "generated/prisma/models";

import {
  setTraceId,
  setDatabaseContext,
  getPaginationOffset,
  buildPaginationMeta,
} from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ListCustomers, IListCustomers } from ".";

export class ListCustomersService
  extends BaseDatabaseService
  implements IListCustomers
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: ListCustomers.Params): Promise<ListCustomers.Response> {
    this.log("info", "Starting process list-customers");

    const { offset, ...pagination } = getPaginationOffset({
      page: params.page,
      limit: params.limit,
    });

    const where: CustomersWhereInput = {
      name: {
        contains: params.name,
        mode: "insensitive",
      },
    };

    const [data, total] = await Promise.all([
      this.db.customers.findMany({
        where,
        orderBy: {
          name: params.orderBy,
        },
        take: pagination.limit,
        skip: offset,
      }),
      this.db.customers.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta({ total, ...pagination }),
    };
  }
}
