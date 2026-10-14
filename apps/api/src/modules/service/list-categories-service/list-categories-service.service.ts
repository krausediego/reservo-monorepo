import { ServiceCategoryGroup } from "generated/prisma/enums";

import { setTraceId, setDatabaseContext } from "@/helpers";
import type { ILoggingManager, IDatabase } from "@/infra";
import { BaseDatabaseService } from "@/modules/shared";

import type { ListCategoriesService, IListCategoriesService } from ".";

export class ListCategoriesServiceService
  extends BaseDatabaseService
  implements IListCategoriesService
{
  constructor(
    protected readonly logger: ILoggingManager,
    protected readonly database: IDatabase,
  ) {
    super(logger, database);
  }

  GROUP_LABELS: Record<ServiceCategoryGroup, string> = {
    HAIR: "Cabelo",
    BEARD: "Barba",
    FACE: "Rosto",
    NAILS: "Unhas",
    BODY: "Corpo",
    OTHER: "Outros",
  };

  GROUP_ORDER: ServiceCategoryGroup[] = [
    "HAIR",
    "BEARD",
    "FACE",
    "NAILS",
    "BODY",
    "OTHER",
  ];

  @setTraceId
  @setDatabaseContext
  async run(): Promise<ListCategoriesService.Response> {
    this.log("info", "Starting process list-categories");

    const categories = await this.db.serviceCategories.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        group: true,
        icon: true,
      },
      where: {
        isActive: true,
      },
      orderBy: [{ group: "asc" }, { name: "asc" }],
    });

    const byGroup = Object.groupBy(categories, (c) => c.group);

    const groups = this.GROUP_ORDER.filter((g) => byGroup[g]?.length).map(
      (g) => ({
        key: g,
        label: this.GROUP_LABELS[g],
        categories: byGroup[g],
      }),
    );

    return { groups };
  }
}
