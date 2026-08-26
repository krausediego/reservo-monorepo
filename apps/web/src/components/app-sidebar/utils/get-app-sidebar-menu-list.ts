import type { LinkProps } from "@tanstack/react-router";
import { LayoutGrid, type LucideIcon } from "lucide-react";

type AppRoutes = NonNullable<LinkProps["to"]>;

export type AppSidebarSubmenu = {
  to: AppRoutes;
  label: string;
  active?: boolean;
};

type AppSidebarMenu = {
  to: AppRoutes;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  submenus?: AppSidebarSubmenu[];
};

type AppSidebarGroup = {
  groupLabel: string;
  menus: AppSidebarMenu[];
};

export function getAppSidebarMenuList(): AppSidebarGroup[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          to: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
  ];
}
