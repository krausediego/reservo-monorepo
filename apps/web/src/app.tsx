import { RouterProvider } from "@tanstack/react-router";
import { queryClient, type TanstackRouter } from "./main";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toast";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

type AppProps = {
  router: TanstackRouter;
};

export function App({ router }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="reservo-ui-theme">
        <RouterProvider router={router} />
        <TanStackRouterDevtools router={router} />
        <Toaster timeout={3000} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
