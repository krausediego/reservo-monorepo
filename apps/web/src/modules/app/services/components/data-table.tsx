import { useTable, type PaginationState } from "@tanstack/react-table";
import * as React from "react";
import { useListServicesSuspenseQuery } from "../hooks";
import { servicesColumns, servicesFeatures } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useSearch } from "@tanstack/react-router";

export function ServicesDataTable() {
  const search = useSearch({ from: "/_app/services/" });

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useListServicesSuspenseQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    orderBy: "desc",
    ...search,
  });

  const table = useTable({
    features: servicesFeatures,
    data: data?.data ?? [],
    columns: servicesColumns,
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: data?.meta.total,
  });

  return (
    <DataTable
      table={table}
      columnsCount={servicesColumns?.length}
      noResultsMessage="Sem serviços"
    />
  );
}
