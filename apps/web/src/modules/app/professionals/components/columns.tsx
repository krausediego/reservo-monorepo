import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { IListProfessionalsSchema } from "@reservo/types";
import {
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Mail, Phone, UserRound } from "lucide-react";
import { ProfessionalsActions } from "./actions";

export const professionalsFeatures = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
});

export const professionalsColumns: Array<
  ColumnDef<
    typeof professionalsFeatures,
    IListProfessionalsSchema.GetResponse["data"][number]
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
    accessorKey: "professional.name",
    header: "Profissional",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={row.original.professional.avatarUrl ?? undefined} />
          <AvatarFallback>
            <UserRound className="size-4" />
          </AvatarFallback>
        </Avatar>
        <p className="font-medium">{row.original.professional.name}</p>
      </div>
    ),
  },
  {
    accessorKey: "professional.user",
    header: "Contato",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="size-4" />
          <p className="text-xs">{row.original.professional.user.email}</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="size-4" />
          <p className="text-xs">
            {row.original.professional.user.phoneNumber ?? "-"}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "services",
    header: "Serviços",
    cell: ({ row }) => <p>{row.original.services.length}</p>,
  },
  {
    accessorKey: "professional.isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.professional.isActive ? "success" : "destructive"}
      >
        {row.original.professional.isActive ? "Ativo" : "Inativo"}
      </Badge>
    ),
  },
  {
    accessorKey: "professional.createdAt",
    header: "Desde",
    cell: ({ row }) => (
      <p>{format(row.original.professional.createdAt, "dd/MM/yyyy")}</p>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ProfessionalsActions professional={row.original.professional} />
    ),
  },
];
