import "@/styles/tailwind.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 5 * 60, // 5 minutes
    },
  },
});

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

export type TanstackRouter = typeof router;

declare module "@tanstack/react-router" {
  interface Register {
    router: TanstackRouter;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App router={router} />
  </StrictMode>,
);
