import type { Row } from "@tanstack/react-table";
import type { servicesFeatures } from "./columns";
import type { IListServicesSchema } from "@reservo/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ServicesActions } from "./actions";
import { formatCents, minutesToTime } from "@/helpers";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

type ServicesCardProps = {
  row: Row<
    typeof servicesFeatures,
    IListServicesSchema.GetResponse["data"][number]
  >;
};

export function ServicesCard({ row }: ServicesCardProps) {
  const item = row.original;

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between rounded-lg gap-8 p-4 shadow-sm transition-colors",
        row.getIsSelected() ? "border-primary bg-primary/5" : "bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select service"
            />
            <h3 className="font-semibold text-lg leading-none">{item.name}</h3>
          </div>

          <p className="text-xs text-muted-foreground mt-1 truncate">
            {item.description}
          </p>
        </div>
        <ServicesActions service={item} />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between bg-muted-foreground/10 p-4 items-end rounded-md">
          <div className="space-y-1">
            <h1 className="text-muted-foreground">Valor do Serviço</h1>
            <h4 className="text-xl font-bold">
              {formatCents(item.priceCents)}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 rounded-md text-foreground bg-muted-foreground/10 dark:bg-background/40 p-1.5">
            <Clock className="size-4" />
            <p>{minutesToTime(item.durationMinutes)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={item.isActive ? "success" : "destructive"}>
            {item.isActive ? "Ativo" : "Inativo"}
          </Badge>

          <p className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-4" />
            {format(item.createdAt, "dd/MM/yyyy")}
          </p>
        </div>
      </div>
    </Card>
  );
}
