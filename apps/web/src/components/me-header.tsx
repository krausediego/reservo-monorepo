import { useMeQuery } from "@/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Bell, LogOut, Settings, User2 } from "lucide-react";
import { memberRoleToText } from "@/helpers";

export function MeHeader() {
  const { data } = useMeQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Avatar>
            <AvatarImage src={data?.user?.image ?? undefined} />
            <AvatarFallback>
              <User2 />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-transparent">
            <div>
              <h1 className="text-sm font-medium">{data?.user?.name}</h1>
              <p className="font-light text-xs text-muted-foreground">
                {
                  memberRoleToText[
                    data?.user?.memberRole as keyof typeof memberRoleToText
                  ]
                }
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings />
            Configurações
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Bell />
            Notificações
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <LogOut />
            Sair
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
