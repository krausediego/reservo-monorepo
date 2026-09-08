import { Checkbox } from "@/components/ui/checkbox";
import type { IListMembersSchema } from "@reservo/types";
import type { Row } from "@tanstack/react-table";
import { UsersDataTableActions } from "./data-table-actions";
import { Badge } from "@/components/ui/badge";
import { memberRoleToText } from "@/helpers";
import { format } from "date-fns";
import type { usersFeatures } from "./columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

type UsersCardProps = {
  row: Row<
    typeof usersFeatures,
    IListMembersSchema.GetResponse["data"][number]
  >;
};

export function UsersCard({ row }: UsersCardProps) {
  const item = row.original;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-lg border p-4 shadow-sm transition-colors hover:border-foreground/30 ${
        row.getIsSelected() ? "border-primary bg-primary/5" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar usuário"
          />
          <Avatar>
            <AvatarImage src={item.user.image ?? undefined} />
            <AvatarFallback>
              <UserRound className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm leading-none">
              {item.user.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {item.user.email}
            </p>
          </div>
        </div>
        <UsersDataTableActions />
      </div>
      <div className="mt-4 space-y-2 text-xs border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Telefone:</span>
          <span>{item.user.phoneNumber || "-"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Permissão:</span>
          <Badge variant="secondary">
            {
              memberRoleToText[
                item.member.role as keyof typeof memberRoleToText
              ]
            }
          </Badge>
        </div>
        {item.member.createdAt && (
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Criado em:</span>
            <span>{format(new Date(item.member.createdAt), "dd/MM/yyyy")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
