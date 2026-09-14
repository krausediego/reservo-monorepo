import { Checkbox } from "@/components/ui/checkbox";
import { formatCents, minutesToTime } from "@/helpers";
import type { IListServicesSchema } from "@reservo/types";
import {
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";

export const servicesFeatures = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
});

export const servicesColumns: Array<
  ColumnDef<
    typeof servicesFeatures,
    IListServicesSchema.GetResponse["data"][number]
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
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "priceCents",
    header: "Preço",
    cell: ({ row }) => <p>{formatCents(row.original.priceCents)}</p>,
  },
  {
    accessorKey: "durationMinutes",
    header: "Duração",
    cell: ({ row }) => <p>{minutesToTime(row.original.durationMinutes)}</p>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => <p>{format(row.original.createdAt, "dd/MM/yyyy")}</p>,
  },
  {
    id: "actions",
    cell: () => {
      // const value = info.row.original;

      return <div>...</div>;
    },
  },
];
