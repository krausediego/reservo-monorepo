import { MemberRole } from "generated/prisma/enums";
import { MembersWhereInput } from "generated/prisma/models";

import {
  setTraceId,
  setDatabaseContext,
  getPaginationOffset,
  buildPaginationMeta,
} from "@/helpers";
import { type ILoggingManager, type IDatabase, basePrisma } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";
import { FieldRef } from "@prisma/client/runtime/client";

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

    const where: MembersWhereInput = {
      organizationId: params.organizationId,
      role: {
        in: params.roles as
          | MemberRole[]
          | FieldRef<"Members", "MemberRole[]">
          | undefined,
      },
      users: {
        name: {
          contains: params.name,
          mode: "insensitive",
        },
      },
    };

    const [data, total] = await Promise.all([
      await basePrisma.members.findMany({
        select: {
          id: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          users: {
            omit: {
              emailVerified: true,
              phoneNumberVerified: true,
            },
          },
        },
        where,
        take: pagination.limit,
        skip: offset,
      }),
      basePrisma.members.count({ where }),
    ]);

    const membersSerialized = data.map(({ users, ...member }) => {
      return {
        member,
        user: users,
      };
    });

    return {
      data: membersSerialized,
      meta: buildPaginationMeta({ total, ...pagination }),
    };
  }
}
