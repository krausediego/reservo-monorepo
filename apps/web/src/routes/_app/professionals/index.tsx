import { ContentLayout } from "@/components/content-layout";
import { DataCardsSkeleton } from "@/components/ui/data-cards-skeleton";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  ProfessionalsDataCard,
  ProfessionalsDataTable,
  ProfessionalsPageActions,
} from "@/modules/app/professionals/components";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_app/professionals/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Tabs defaultValue="card">
      <ContentLayout
        title="Profissionais"
        description="Gerencie os profissionais do seu estabelecimento, atribua serviços, controle os horários da agenda..."
        action={<ProfessionalsPageActions />}
      >
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
