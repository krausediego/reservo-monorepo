import { Link, useLocation } from "@tanstack/react-router";
import { getAppSidebarMenuList } from "./utils";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { AppSidebarCollapseButton } from "./app-sidebar-collapse-button";

type AppSidebarMenuProps = {
  isOpen?: boolean;
};

export function AppSidebarMenu({ isOpen }: AppSidebarMenuProps) {
  const { pathname } = useLocation();
  const menuList = getAppSidebarMenuList();

  return (
    <ScrollArea className="[&>div>div[style]]:block!">
      <nav className="mt-8 w-full h-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li
              key={index}
              className={cn("w-full", groupLabel ? "pt-5" : "pt-0")}
            >
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-62 truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      delay={100}
                      render={
                        <div className="w-full flex justify-center items-center">
                          <Ellipsis className="size-5" />
                        </div>
                      }
                    />
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2" />
              )}
              {menus.map(
                ({ to, label, icon: Icon, active, submenus }, index) =>
                  !submenus || submenus.length === 0 ? (
                    <div key={index} className="w-full">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            delay={100}
                            render={
                              <Button
                                variant={
                                  (active === undefined &&
                                    pathname.startsWith(to)) ||
                                  active
                                    ? "secondary"
                                    : "ghost"
                                }
                                className="w-full justify-start h-10 mb-1"
                              >
                                <Link to={to}>
                                  <span className={cn(isOpen && "mr-4")}>
                                    <Icon className="size-4.5" />
                                  </span>
                                  <p
                                    className={cn(
                                      "max-w-50 truncate",
                                      !isOpen
                                        ? "-translate-x-96 opacity-0"
                                        : "translate-x-0 opacity-100",
                                    )}
                                  >
                                    {label}
                                  </p>
                                </Link>
                              </Button>
                            }
                          />
                          {!isOpen && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div key={index} className="w-full">
                      <AppSidebarCollapseButton
                        icon={Icon}
                        label={label}
                        active={
                          active === undefined
                            ? pathname.startsWith(to)
                            : active
                        }
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
