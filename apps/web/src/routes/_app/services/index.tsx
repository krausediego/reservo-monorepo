import { ContentLayout } from "@/components/content-layout";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import {
  ServicesDataTable,
  ServicesFilters,
  ServicesPageActions,
} from "@/modules/app/services/components";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_app/services/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContentLayout
      className="flex-col"
      title="Serviços"
      description="Crie serviços e atribua a seus profissionais "
      action={<ServicesPageActions />}
    >
      <ServicesFilters />

      <Suspense
        fallback={
          <DataTableSkeleton columnCount={6} rowCount={10} showCheckbox />
        }
      >
        <ServicesDataTable />
      </Suspense>
    </ContentLayout>
  );
}
