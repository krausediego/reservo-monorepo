import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { AppSidebarHeader } from "./app-sidebar-header";
import { AppSidebarNav } from "./app-sidebar-nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <AppSidebarNav />
      </SidebarContent>
    </Sidebar>
  );
}
