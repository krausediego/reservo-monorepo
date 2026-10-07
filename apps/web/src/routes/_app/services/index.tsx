import { ContentLayout } from "@/components/content-layout";
import { DataCardsSkeleton } from "@/components/ui/data-cards-skeleton";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  ServicesDataCard,
  ServicesDataTable,
  ServicesFilters,
  ServicesPageActions,
} from "@/modules/app/services/components";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import z from "zod";

const servicesSearchSchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  professionals: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val.join(",");
      return val;
    }),
});

export const Route = createFileRoute("/_app/services/")({
  validateSearch: (search) => servicesSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Tabs defaultValue="card">
      <ContentLayout
        className="flex-col"
        title="Serviços"
        description="Crie serviços e atribua a seus profissionais "
        action={<ServicesPageActions />}
      >
        <ServicesFilters />

        <TabsContent value="card">
          <Suspense fallback={<DataCardsSkeleton cardCount={9} showCheckbox />}>
            <ServicesDataCard />
          </Suspense>
        </TabsContent>

        <TabsContent value="list">
          <Suspense
            fallback={<DataTableSkeleton columnCount={6} showCheckbox />}
          >
            <ServicesDataTable />
          </Suspense>
        </TabsContent>
      </ContentLayout>
    </Tabs>
  );
}
