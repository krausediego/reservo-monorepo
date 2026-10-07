import { useTable, type PaginationState } from "@tanstack/react-table";
import * as React from "react";
import { useListProfessionalsSuspenseQuery } from "../hooks";
import { professionalsColumns, professionalsFeatures } from "./columns";
import { DataCards } from "@/components/ui/data-cards";
import { ProfessionalsCard } from "./card";
import { useSearch } from "@tanstack/react-router";

export function ProfessionalsDataCard() {
  const search = useSearch({ from: "/_app/professionals/" });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const params = {
    ...search,
    services: search.services as unknown as string[],
  };

  const { data } = useListProfessionalsSuspenseQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    orderBy: "asc",
    ...params,
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
    <DataCards
      table={table}
      renderCard={(row) => <ProfessionalsCard row={row} />}
    />
  );
}
