import { useMeQuery } from "@/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { LogOut, UserRound } from "lucide-react";
import { memberRoleToText } from "@/helpers";
import { authClient } from "@/lib/better-auth";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "sonner";

export function AppSidebarFooter() {
  const { data } = useMeQuery();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      return toast.error("Ocorreu um erro ao sair.");
    }

    navigate({ to: "/sign-in", replace: true });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar>
                <AvatarImage src={data?.user?.imageUrl ?? undefined} />
                <AvatarFallback>
                  <UserRound className="size-4" />
                </AvatarFallback>
              </Avatar>

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

              <LogOut className="text-muted-foreground ml-auto" />
            </SidebarMenuButton>
          </AlertDialogTrigger>

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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
