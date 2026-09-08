import { cn } from "@/lib/utils";
import type {
  ReactTable,
  Row,
  RowData,
  Table_RowPagination,
  TableFeatures,
} from "@tanstack/react-table";
import { Button } from "./button";

export type DataCardsProps<
  TData extends RowData,
  TFeatures extends TableFeatures = TableFeatures,
> = {
  table: ReactTable<TFeatures, TData> & Table_RowPagination<TFeatures, TData>;
  renderCard: (row: Row<TFeatures, TData>) => React.ReactNode;
  noResultMessage?: string;
  gridClassName?: string;
};

export function DataCards<
  TData extends RowData,
  TFeatures extends TableFeatures = TableFeatures,
>({
  table,
  renderCard,
  noResultMessage = "Nenhum resultado encontrado.",
  gridClassName,
}: DataCardsProps<TData, TFeatures>) {
  const rows = table.getRowModel().rows;

  return (
    <div className="flex flex-col w-full gap-4">
      {rows.length ? (
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
            gridClassName,
          )}
        >
          {rows.map((row) => (
            <div key={row.id}>{renderCard(row)}</div>
          ))}
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
          {noResultMessage}
        </div>
      )}

      <div className="ml-auto space-x-4">
        <Button
          variant="outline"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
