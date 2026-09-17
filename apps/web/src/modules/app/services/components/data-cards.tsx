import { useTable, type PaginationState } from "@tanstack/react-table";
import * as React from "react";
import { useListServicesQuery } from "../hooks";
import { servicesColumns, servicesFeatures } from "./columns";
import { DataCards } from "@/components/ui/data-cards";
import { ServicesCard } from "./card";

export function ServicesDataCard() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useListServicesQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    orderBy: "desc",
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
