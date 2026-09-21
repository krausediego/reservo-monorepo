import { Checkbox } from "@/components/ui/checkbox";
import { memberRoleToText } from "@/helpers";
import type { IListMembersSchema } from "@reservo/types";
import {
  tableFeatures,
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  type ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { UsersActions } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

export const usersFeatures = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
});

export const usersColumns: Array<
  ColumnDef<
    typeof usersFeatures,
    IListMembersSchema.GetResponse["data"][number]
  >
> = [
  {
    id: "select",
    header: ({ table }) => {
      const indeterminate =
        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected();

      return (
        <Checkbox
          checked={
            indeterminate ? "indeterminate" : table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user.name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={row.original.user.imageUrl ?? undefined} />
          <AvatarFallback>
            <UserRound className="size-4" />
          </AvatarFallback>
        </Avatar>
        <p>{row.original.user.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "user.email",
    header: "E-mail",
  },
  {
    accessorKey: "user.phoneNumber",
    header: "Telefone",
    cell: (info) => {
      const value = info.getValue<string>();

      return <p>{!value ? "-" : value}</p>;
    },
  },
  {
    accessorKey: "member.role",
    header: "Permissão",
    cell: (info) => {
      const value = info.getValue<keyof typeof memberRoleToText>();

      return <p>{memberRoleToText[value]}</p>;
    },
  },
  {
    accessorKey: "member.createdAt",
    header: "Membro desde",
    cell: (info) => {
      const value = info.getValue<Date>();

      return <p>{value && format(value, "dd/MM/yyyy HH:mm")}</p>;
    },
  },
  {
    id: "actions",
    cell: (info) => {
      const value = info.row.original;

      return <UsersActions memberId={value.member.id} />;
    },
  },
];
