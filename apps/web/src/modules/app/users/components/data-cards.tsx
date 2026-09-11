import * as React from "react";
import { useTable, type PaginationState } from "@tanstack/react-table";
import { useListUsersQuery } from "../hooks";
import { usersColumns, usersFeatures } from "./columns";
import { DataCards } from "@/components/ui/data-cards";
import { UsersCard } from "./card";

export function UsersDataCards() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9,
  });

  const { data } = useListUsersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const table = useTable({
    features: usersFeatures,
    data: data.data,
    columns: usersColumns,
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
    rowCount: data.meta.total,
  });

  return (
    <DataCards table={table} renderCard={(row) => <UsersCard row={row} />} />
  );
}
