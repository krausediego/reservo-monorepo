import { useLocation, useRouter } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { getSettingsMenuList } from "./helpers";

export function SettingsSidebarMenuNav() {
  const { pathname } = useLocation();
  const router = useRouter();

  const menuList = getSettingsMenuList();

  return menuList.map(({ name, to, icon: Icon }) => (
    <Button
      key={name}
      className="lg:w-50 justify-start gap-3"
      variant={pathname.includes(to) ? "secondary" : "ghost"}
      onClick={() => router.navigate({ to: to })}
    >
      <Icon />
      {name}
    </Button>
  ));
}
