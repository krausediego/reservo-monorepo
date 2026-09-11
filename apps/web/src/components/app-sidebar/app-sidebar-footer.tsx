import { useMeQuery } from "@/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { LogOut, UserRound } from "lucide-react";
import { memberRoleToText } from "@/helpers";
import { authClient } from "@/lib/better-auth";
import { useNavigate } from "@tanstack/react-router";

export function AppSidebarFooter() {
  const { data } = useMeQuery();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: "/sign-in" });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" onClick={handleSignOut}>
          <Avatar>
            <AvatarImage src={data?.user?.image ?? undefined} />
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
