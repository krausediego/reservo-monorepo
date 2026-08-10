import "@/styles/tailwind.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({ routeTree });

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
