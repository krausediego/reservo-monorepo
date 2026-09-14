import type { LinkProps } from "@tanstack/react-router";
import {
  HandCoins,
  LayoutDashboard,
  Settings,
  Users2,
  type LucideIcon,
} from "lucide-react";

type AppRouteToProps = NonNullable<LinkProps["to"]>;

type AppSidebarMenu = {
  to: AppRouteToProps;
  name: string;
  icon: LucideIcon;
};

type AppSidebarGroup = {
  groupLabel: string;
  menus: AppSidebarMenu[];
};

export function getMenuList(): AppSidebarGroup[] {
  return [
    {
      groupLabel: "Visão geral",
      menus: [
        {
          to: "/dashboard",
          name: "Dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupLabel: "Comercial",
      menus: [
        {
          to: "/services",
          name: "Serviços",
          icon: HandCoins,
        },
      ],
    },
    {
      groupLabel: "Sistema",
      menus: [
        {
          to: "/users",
          name: "Usuários",
          icon: Users2,
        },
        {
          to: "/settings/profile",
          name: "Configurações",
          icon: Settings,
        },
      ],
    },
  ];
}
