import { RouterProvider } from "@tanstack/react-router";
import type { TanstackRouter } from "./main";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toast";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

type AppProps = {
  router: TanstackRouter;
};

export function App({ router }: AppProps) {
  const [queryClient] = useState<QueryClient>(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60, // 5 minutes
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="reservo-ui-theme">
        <RouterProvider router={router} />
        <TanStackRouterDevtools router={router} />
        <Toaster timeout={3000} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
