import { ContentLayout } from "@/components/content-layout";
import { DataCardsSkeleton } from "@/components/ui/data-cards-skeleton";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  ProfessionalsDataCard,
  ProfessionalsDataTable,
  ProfessionalsFilters,
  ProfessionalsPageActions,
} from "@/modules/app/professionals/components";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import z from "zod";

const professionalsSearchSchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  services: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val.join(",");
      return val;
    }),
});

export const Route = createFileRoute("/_app/professionals/")({
  validateSearch: (search) => professionalsSearchSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Tabs defaultValue="card">
      <ContentLayout
        className="flex-col"
        title="Profissionais"
        description="Gerencie os profissionais do seu estabelecimento, atribua serviços, controle os horários da agenda..."
        action={<ProfessionalsPageActions />}
      >
        <ProfessionalsFilters />

        <TabsContent value="card">
          <Suspense fallback={<DataCardsSkeleton cardCount={9} showCheckbox />}>
            <ProfessionalsDataCard />
          </Suspense>
        </TabsContent>

        <TabsContent value="list">
          <Suspense
            fallback={<DataTableSkeleton columnCount={6} showCheckbox />}
          >
            <ProfessionalsDataTable />
          </Suspense>
        </TabsContent>
      </ContentLayout>
    </Tabs>
  );
}
