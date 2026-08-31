import * as React from "react";
import { useTable, type PaginationState } from "@tanstack/react-table";
import { useListUsersQuery } from "../hooks";
import { usersColumns, usersFeatures } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export function UsersDataTable() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useListUsersQuery({
    page: pagination.pageIndex,
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
    <DataTable
      table={table}
      columnsCount={usersColumns.length}
      noResultsMessage="Sem usuários"
    />
  );
}
