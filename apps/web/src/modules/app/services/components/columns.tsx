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
import { ServicesActions } from "./actions";
import { Badge } from "@/components/ui/badge";

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
    cell: ({ row }) => (
      <p className="max-w-75 truncate" title={row.original.description}>
        {row.original.description}
      </p>
    ),
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
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "success" : "destructive"}>
        {row.original.isActive ? "Ativo" : "Inativo"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => <p>{format(row.original.createdAt, "dd/MM/yyyy")}</p>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ServicesActions service={row.original} />,
  },
];
