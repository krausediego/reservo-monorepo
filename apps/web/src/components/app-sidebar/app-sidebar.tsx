import { cn } from "@/lib/utils";
import { AppSidebarToggle } from "./app-sidebar-toggle";
import { useSidebar, useStore } from "./hooks";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { PanelsTopLeft } from "lucide-react";
import { AppSidebarMenu } from "./app-sidebar-menu";

export function AppSidebar() {
  const sidebar = useStore({ store: useSidebar, callback: (x) => x });

  if (!sidebar) return null;

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-22.5" : "w-72",
        settings.disabled && "hidden",
      )}
    >
      <AppSidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />

      <div
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            !getOpenState() ? "translate-x-1" : "translate-x-0",
          )}
          variant="link"
        >
          <Link to="/dashboard" className="flex items-center gap-2">
            <PanelsTopLeft className="size-6 mr-1" />

            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                !getOpenState()
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100",
              )}
            >
              Brand
            </h1>
          </Link>
        </Button>
        <AppSidebarMenu />
      </div>
    </aside>
  );
}
