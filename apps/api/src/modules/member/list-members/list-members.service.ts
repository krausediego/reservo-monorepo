import { UsersWhereInput } from "generated/prisma/models";

import {
  setTraceId,
  setDatabaseContext,
  getPaginationOffset,
  buildPaginationMeta,
} from "@/helpers";
import { type ILoggingManager, type IDatabase, basePrisma } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ListMembers, IListMembers } from ".";

export class ListMembersService
  extends BaseDatabaseService
  implements IListMembers
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  @setTraceId
  @setDatabaseContext
  async run(params: ListMembers.Params): Promise<ListMembers.Response> {
    this.log("info", "Starting process list-members");

    const { offset, ...pagination } = getPaginationOffset({
      page: params.page,
      limit: params.limit,
    });

    const where: UsersWhereInput = {
      members: {
        every: {
          organizationId: params.organizationId,
        },
      },
      name: {
        contains: params.name,
        mode: "insensitive",
      },
    };

    const [data, total] = await Promise.all([
      await basePrisma.users.findMany({
        omit: {
          emailVerified: true,
          phoneNumberVerified: true,
        },
        where,
        include: {
          members: {
            select: {
              id: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        take: pagination.limit,
        skip: offset,
        orderBy: {
          name: params.orderBy,
        },
      }),
      basePrisma.users.count({ where }),
    ]);

    const membersSerialized = data.map(({ members, ...user }) => {
      return {
        user,
        member: members[0],
      };
    });

    return {
      data: membersSerialized,
      meta: buildPaginationMeta({ total, ...pagination }),
    };
  }
}
