import { AppointmentsWhereInput } from "generated/prisma/models";

import {
  setTraceId,
  setDatabaseContext,
  getPaginationOffset,
  buildPaginationMeta,
} from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ListAppointments, IListAppointments } from ".";

export class ListAppointmentsService
  extends BaseDatabaseService
  implements IListAppointments
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
    params: ListAppointments.Params,
  ): Promise<ListAppointments.Response> {
    this.log("info", "Starting process list-appointments");

    const { offset, ...pagination } = getPaginationOffset({
      page: params.page,
      limit: params.limit,
    });

    const where: AppointmentsWhereInput = {
      startsAt: {
        lt: params.endsAt,
      },
      endsAt: {
        gt: params.startsAt,
      },
      status: {
        in: params.status,
      },
      professionalId: {
        in: params.professionals,
      },
      serviceId: {
        in: params.services,
      },
    };

    const [data, total] = await Promise.all([
      this.db.appointments.findMany({
        select: {
          id: true,
          professionalId: true,
          serviceId: true,
          customerId: true,
          startsAt: true,
          endsAt: true,
          status: true,
          origin: true,
          priceCents: true,
          durationMin: true,
          notes: true,
          internalNotes: true,
        },
        where,
        take: pagination.limit,
        skip: offset,
      }),
      this.db.appointments.count({
        where,
      }),
    ]);

    return {
      data,
      meta: buildPaginationMeta({ total, ...pagination }),
    };
  }
}
