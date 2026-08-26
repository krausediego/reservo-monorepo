import { ChevronDown, Dot, type LucideIcon } from "lucide-react";
import type { AppSidebarSubmenu } from "./utils";
import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { DropdownMenu } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AppSidebarCollapseButtonProps = {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: AppSidebarSubmenu[];
  isOpen?: boolean;
};

export function AppSidebarCollapseButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
}: AppSidebarCollapseButtonProps) {
  const { pathname } = useLocation();
  const isSubmenuActive = submenus.some((submenu) =>
    submenu.active === undefined ? submenu.to === pathname : submenu.active,
  );

  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return isOpen ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        render={
          <Button
            variant={isSubmenuActive ? "secondary" : "ghost"}
            className="w-full justify-start h-10"
          >
            <div className="w-full items-center flex justify-between">
              <div className="flex items-center">
                <span className="mr-4">
                  <Icon className="size-4.5" />
                </span>

                <p
                  className={cn(
                    "max-w-37.5 truncate",
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0",
                  )}
                >
                  {label}
                </p>
              </div>

              <div
                className={cn(
                  "whitespace-nowrap",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0",
                )}
              >
                <ChevronDown className="size-4.5 transition-transform duration-200" />
              </div>
            </div>
          </Button>
        }
      />
      <CollapsibleContent className="overflow-hidden data-[state=closer]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ to, label, active }, index) => (
          <Button
            key={index}
            variant={
              (active === undefined && pathname === to) || active
                ? "secondary"
                : "ghost"
            }
            className="w-full justify-start h-10 mb-1"
          >
            <Link to={to}>
              <span className="mr-4 ml-2">
                <Dot className="size-4.5" />
              </span>

              <p
                className={cn(
                  "max-w-42.5 truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0",
                )}
              >
                {label}
              </p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu></DropdownMenu>
  );
}
