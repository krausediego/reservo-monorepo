import type { Row } from "@tanstack/react-table";
import type { professionalsFeatures } from "./columns";
import type { IListProfessionalsSchema } from "@reservo/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfessionalsActions } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Clock,
  HandCoins,
  Pencil,
  Percent,
  Star,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAvailability } from "@/helpers";
import { ServicesBadges } from "./services-badges";

type ProfessionalsCardProps = {
  row: Row<
    typeof professionalsFeatures,
    IListProfessionalsSchema.GetResponse["data"][number]
  >;
};

export function ProfessionalsCard({ row }: ProfessionalsCardProps) {
  const item = row.original;

  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between rounded-lg gap-2 border p-4 shadow-sm transition-colors hover:border-foreground/30",
        row.getIsSelected() ? "border-primary bg-primary/5" : "bg-card",
      )}
    >
      <div className="w-full flex items-center justify-between gap-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select service"
        />

        <div className="flex items-center gap-2">
          <Badge
            variant={item.professional.isActive ? "success" : "destructive"}
          >
            <div
              className={cn(
                "size-1.5 rounded-full",
                item.professional.isActive ? "bg-emerald-500" : "bg-rose-500",
              )}
            />
            {item.professional.isActive ? "Ativo" : "Inativo"}
          </Badge>

          <ProfessionalsActions professional={item.professional} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar
            size="xl"
            className={cn(
              "ring-2 relative",
              item.professional.isActive
                ? "ring-emerald-500/50"
                : "ring-rose-500/50",
            )}
          >
            <AvatarImage src={item.professional.avatarUrl ?? undefined} />
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>

            <div
              className={cn(
                "size-4 rounded-full absolute bottom-0.5 -right-0.5",
                item.professional.isActive ? "bg-emerald-500" : "bg-rose-500",
              )}
            />
          </Avatar>

          <div className="w-full min-w-0">
            <h2 className="text-lg font-medium">{item.professional.name}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {item.professional.bio}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="size-4 text-yellow-500 fill-yellow-500" />
              <h4>{item.rating.ratingAvg}</h4>
              <p className="text-muted-foreground">
                ({item.rating.reviewCount} avaliações)
              </p>
            </div>
          </div>
        </div>

        <ServicesBadges services={item.services} />

        <div className="flex items-end bg-muted-foreground/10 p-4 rounded-md">
          <div className="space-y-2.5 flex-1">
            <h3 className="text-muted-foreground">Serviços habilitados</h3>
            <div className="flex items-center gap-2">
              <HandCoins className="size-5 text-primary" />
              <h1 className="text-lg font-semibold leading-0">
                {item.services.length} Serviços
              </h1>
            </div>
          </div>

          <div className="space-y-2.5 flex-1">
            <h3 className="text-muted-foreground">Comissão atual</h3>
            <div className="flex items-center gap-2">
              <Percent className="size-5 text-primary" />
              <h1 className="text-lg font-semibold leading-0">50%</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          <p className="text-xs">{formatAvailability(item.availabilities)}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1">
            <CalendarDays />
            Ver Agenda
          </Button>

          <Button variant="secondary">
            <Pencil />
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
}
