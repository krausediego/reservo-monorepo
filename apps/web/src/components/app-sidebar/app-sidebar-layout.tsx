import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import { useSidebar, useStore } from "./hooks";

type AppSidebarLayoutProps = {
  children: React.ReactNode;
};

export function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const sidebar = useStore({ store: useSidebar, callback: (x) => x });

  if (!sidebar) return null;

  const { getOpenState, settings } = sidebar;

  return (
    <>
      <AppSidebar />
      <main
        className={cn(
          "min-h-[calc(100vh-56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-22.5" : "lg:ml-72"),
        )}
      >
        {children}
      </main>
    </>
  );
}
