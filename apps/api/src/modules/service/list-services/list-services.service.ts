import { ServicesWhereInput } from "generated/prisma/models";

import {
  setTraceId,
  setDatabaseContext,
  getPaginationOffset,
  buildPaginationMeta,
} from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ListServices, IListServices } from ".";

export class ListServicesService
  extends BaseDatabaseService
  implements IListServices
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: ListServices.Params): Promise<ListServices.Response> {
    this.log("info", "Starting process list-services");

    const { offset, ...pagination } = getPaginationOffset({
      page: params.page,
      limit: params.limit,
    });

    const where: ServicesWhereInput = {
      isActive: true,
      name: {
        contains: params.name,
        mode: "insensitive",
      },
    };

    const [data, total] = await Promise.all([
      this.db.services.findMany({
        where,
        take: pagination.limit,
        skip: offset,
        orderBy: {
          name: params.orderBy,
        },
      }),
      this.db.services.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta({ total, ...pagination }),
    };
  }
}
