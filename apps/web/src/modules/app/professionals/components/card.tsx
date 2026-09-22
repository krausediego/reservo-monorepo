import type { Row } from "@tanstack/react-table";
import type { professionalsFeatures } from "./columns";
import type { IListProfessionalsSchema } from "@reservo/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfessionalsActions } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ProfessionalsCardProps = {
  row: Row<
    typeof professionalsFeatures,
    IListProfessionalsSchema.GetResponse["data"][number]
  >;
};

export function ProfessionalsCard({ row }: ProfessionalsCardProps) {
  const item = row.original;

  return (
    <div
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

        <ProfessionalsActions professional={item.professional} />
      </div>

      <div className="flex flex-col items-center text-center">
        <Avatar size="xl">
          <AvatarImage src={item.professional.avatarUrl ?? undefined} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>

        <div className="w-full min-w-0">
          <h2 className="text-lg font-medium">{item.professional.name}</h2>
          <p className="text-sm text-muted-foreground truncate">
            {item.professional.bio}
          </p>
          <Badge
            variant={item.professional.isActive ? "success" : "destructive"}
          >
            {item.professional.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </div>

      <Separator />

      <div>
        <div className="text-center">
          <h3 className="text-lg font-medium">{item.services.length}</h3>
          <p className="text-xs text-muted-foreground">Serviços</p>
        </div>
      </div>
    </div>
  );
}
