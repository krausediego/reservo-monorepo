import * as React from "react";
import { useTable, type PaginationState } from "@tanstack/react-table";
import { useListUsersSuspenseQuery } from "../hooks";
import { usersColumns, usersFeatures } from "./columns";
import { DataCards } from "@/components/ui/data-cards";
import { UsersCard } from "./card";
import { useSearch } from "@tanstack/react-router";
import type { memberRoleToText } from "@/helpers";

export function UsersDataCards() {
  const search = useSearch({ from: "/_app/users/" });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 9,
  });

  const param = {
    ...search,
    roles: search.roles as unknown as Array<keyof typeof memberRoleToText>,
  };

  const { data } = useListUsersSuspenseQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    orderBy: "desc",
    ...param,
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
