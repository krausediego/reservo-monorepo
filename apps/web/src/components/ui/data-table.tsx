import { Button } from "./button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import type {
  ReactTable,
  RowData,
  TableFeatures,
  Table_RowPagination,
} from "@tanstack/react-table";

type DataTableProps<
  TData extends RowData,
  TFeatures extends TableFeatures = TableFeatures,
> = {
  table: ReactTable<TFeatures, TData> & Table_RowPagination<TFeatures, TData>;
  columnsCount: number;
  noResultsMessage?: string;
};

export function DataTable<
  TData extends RowData,
  TFeatures extends TableFeatures = TableFeatures,
>({ table, columnsCount, noResultsMessage }: DataTableProps<TData, TFeatures>) {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsCount} className="h-24 text-center">
                  {noResultsMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
