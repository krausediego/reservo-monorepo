import type { LinkProps } from "@tanstack/react-router";
import {
  Bell,
  Briefcase,
  Brush,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type AppRouteToProps = NonNullable<LinkProps["to"]>;

type SettingsSidebarMenu = {
  to: AppRouteToProps;
  name: string;
  icon: LucideIcon;
};

export function getSettingsMenuList(): SettingsSidebarMenu[] {
  return [
    {
      to: "/settings/profile",
      name: "Perfil",
      icon: UserRound,
    },
    {
      to: "/settings/establishment",
      name: "Estabelecimento",
      icon: Briefcase,
    },
    {
      to: "/settings/notifications",
      name: "Notificações",
      icon: Bell,
    },
    {
      to: "/settings/appearance",
      name: "Aparência",
      icon: Brush,
    },
  ];
}
