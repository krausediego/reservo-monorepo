import type { Row } from "@tanstack/react-table";
import type { servicesFeatures } from "./columns";
import type { IListServicesSchema } from "@reservo/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ServicesActions } from "./actions";
import { formatCents, minutesToTime } from "@/helpers";
import { Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type ServicesCardProps = {
  row: Row<
    typeof servicesFeatures,
    IListServicesSchema.GetResponse["data"][number]
  >;
};

export function ServicesCard({ row }: ServicesCardProps) {
  const item = row.original;

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-lg gap-8 border p-4 shadow-sm transition-colors hover:border-foreground/30",
        row.getIsSelected() ? "border-primary bg-primary/5" : "bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select service"
          />

          <div>
            <h3 className="font-semibold text-sm leading-none">{item.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {item.description}
            </p>
          </div>
        </div>
        <ServicesActions service={item} />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h4 className="text-xl font-bold">{formatCents(item.priceCents)}</h4>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3" />
            <p>{minutesToTime(item.durationMinutes)}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Badge variant={item.isActive ? "success" : "destructive"}>
            {item.isActive ? "Ativo" : "Inativo"}
          </Badge>

          <p className="text-muted-foreground">
            {format(item.createdAt, "dd/MM/yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}
