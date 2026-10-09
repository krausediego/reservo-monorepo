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
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/better-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useState } from "react";

export function MeHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { data } = useMeQuery();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/sign-in", replace: true });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Avatar>
              <AvatarImage src={data?.user?.imageUrl ?? undefined} />
              <AvatarFallback>
                <User2 />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="focus:bg-transparent"
              onClick={() => navigate({ to: "/settings/profile" })}
            >
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
            <DropdownMenuItem
              onClick={() => navigate({ to: "/settings/establishment" })}
            >
              <Settings />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate({ to: "/settings/notifications" })}
            >
              <Bell />
              Notificações
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsOpen(true)}
            >
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleSignOut}>
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
