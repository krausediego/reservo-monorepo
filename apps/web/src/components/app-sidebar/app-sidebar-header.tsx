import { Zap } from "lucide-react";
import { SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { useMeQuery } from "@/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebarHeader() {
  const { data } = useMeQuery();

  return (
    <SidebarMenu className="h-12 flex justify-center">
      <SidebarMenuItem className="p-2 group-data-[collapsible=icon]:p-0 transition-[padding]">
        <div className="flex gap-2">
          <Avatar className="rounded-md after:rounded-md">
            <AvatarImage src={data?.establishment?.logoUrl ?? undefined} />
            <AvatarFallback className="rounded-md bg-primary">
              <Zap className="size-4 text-primary-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {data?.establishment?.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {data?.establishment?.phone}
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
