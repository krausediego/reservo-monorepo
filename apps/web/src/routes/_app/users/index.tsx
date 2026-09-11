import { ContentLayout } from "@/components/content-layout";
import { DataCardsSkeleton } from "@/components/ui/data-cards-skeleton";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  UsersDataCards,
  UsersDataTable,
  UsersFilters,
  UsersPageActions,
} from "@/modules/app/users/components";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Suspense } from "react";

const usersSearchSchema = z.object({
  name: z.string().optional(),
  roles: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val.join(",");
      return val;
    }),
});

export const Route = createFileRoute("/_app/users/")({
  validateSearch: (search) => usersSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Tabs defaultValue="card">
      <ContentLayout
        className="flex-col"
        title="Usuários"
        description="Gerencie os usuários e permissões"
        action={<UsersPageActions />}
      >
        <UsersFilters />

        <TabsContent value="card">
          <Suspense fallback={<DataCardsSkeleton cardCount={9} showCheckbox />}>
            <UsersDataCards />
          </Suspense>
        </TabsContent>

        <TabsContent value="list">
          <Suspense
            fallback={<DataTableSkeleton columnCount={5} showCheckbox />}
          >
            <UsersDataTable />
          </Suspense>
        </TabsContent>
      </ContentLayout>
    </Tabs>
  );
}
