import { useTable, type PaginationState } from "@tanstack/react-table";
import * as React from "react";
import { useListServicesSuspenseQuery } from "../hooks";
import { servicesColumns, servicesFeatures } from "./columns";
import { DataCards } from "@/components/ui/data-cards";
import { ServicesCard } from "./card";
import { useSearch } from "@tanstack/react-router";

export function ServicesDataCard() {
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
    <DataCards table={table} renderCard={(row) => <ServicesCard row={row} />} />
  );
}
