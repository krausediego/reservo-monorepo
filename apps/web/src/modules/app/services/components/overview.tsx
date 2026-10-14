import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useOverviewServiceSuspenseQuery } from "../hooks";
import { getOverviewInfos } from "../helpers";

export function ServicesOverview() {
  const { data: overviewService, dataUpdatedAt } =
    useOverviewServiceSuspenseQuery();

  const overviewData = getOverviewInfos(overviewService, dataUpdatedAt);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {overviewData.map(({ icon: Icon, ...overview }) => (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="uppercase">{overview.title}</CardTitle>
            <CardAction className="p-2 rounded-md bg-muted-foreground">
              <Icon className="size-5 text-muted" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl text-primary">{overview.number}</h1>
              <p className="text-muted-foreground">{overview.relation}</p>
            </div>
            {overview.description}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
