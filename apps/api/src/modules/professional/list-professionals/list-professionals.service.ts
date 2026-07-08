import { ProfessionalsWhereInput } from "generated/prisma/models";

import { setTraceId, setDatabaseContext } from "@/helpers";
import type { ILoggingManager, IDatabase, IStorage } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";
import { buildPaginationMeta, getPaginationOffset } from "@reservo/types";

import type { ListProfessionals, IListProfessionals } from ".";

export class ListProfessionalsService
  extends BaseDatabaseService
  implements IListProfessionals
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
    params: ListProfessionals.Params,
  ): Promise<ListProfessionals.Response> {
    this.log("info", "Starting process list-professionals");

    const { offset, ...pagination } = getPaginationOffset({
      page: params.page,
      limit: params.limit,
    });

    const where: ProfessionalsWhereInput = {
      isActive: true,
      name: {
        contains: params.name,
        mode: "insensitive",
      },
    };

    const [data, total] = await Promise.all([
      this.db.professionals.findMany({
        include: {
          professionalAvailabilities: true,
          professionalServices: {
            select: {
              services: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where,
        take: pagination.limit,
        skip: offset,
        orderBy: {
          name: params.orderBy,
        },
      }),
      this.db.professionals.count({ where }),
    ]);

    const professionalsSerialized = await Promise.all(
      data.map(
        async ({
          professionalAvailabilities,
          professionalServices,
          ...professional
        }) => {
          return {
            professional: {
              ...professional,
              avatarUrl:
                professional.avatarStorageKey &&
                (await this.storage.getSignedUrl({
                  key: professional.avatarStorageKey,
                })),
            },
            availabilities: professionalAvailabilities,
            services: professionalServices.map((ps) => ps.services),
          };
        },
      ),
    );

    return {
      data: professionalsSerialized,
      meta: buildPaginationMeta({ total, ...pagination }),
    };
  }
}
