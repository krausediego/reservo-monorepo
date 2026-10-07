import { useTable, type PaginationState } from "@tanstack/react-table";
import * as React from "react";
import { useListProfessionalsSuspenseQuery } from "../hooks";
import { professionalsColumns, professionalsFeatures } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useSearch } from "@tanstack/react-router";

export function ProfessionalsDataTable() {
  const search = useSearch({ from: "/_app/professionals/" });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useListProfessionalsSuspenseQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    orderBy: "asc",
    ...search,
  });

  const table = useTable({
    features: professionalsFeatures,
    data: data?.data ?? [],
    columns: professionalsColumns,
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: data?.meta.total,
  });

  return (
    <DataTable table={table} columnsCount={professionalsColumns?.length} />
  );
}
