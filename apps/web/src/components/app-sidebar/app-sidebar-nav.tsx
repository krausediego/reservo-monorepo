import { useLocation, useRouter } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { getMenuList } from "./utils/menu-items";

export function AppSidebarNav() {
  const { pathname } = useLocation();
  const router = useRouter();

  const menuList = getMenuList();

  return menuList.map((menu) => (
    <SidebarGroup key={menu.groupLabel}>
      <SidebarGroupLabel>{menu.groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {menu.menus.map(({ name, icon: Icon, to }) => (
          <SidebarMenuItem key={name}>
            <SidebarMenuButton
              onClick={() => router.navigate({ to })}
              variant={
                pathname.split("/")[1] === to.split("/")[1]
                  ? "secondary"
                  : "default"
              }
              tooltip={name}
            >
              <Icon />
              <span>{name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ));
}
