
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "../ui/card"
import { ProductionItem } from "@/lib/types"

interface DataTableProps<TData extends ProductionItem, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends ProductionItem, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
   const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
     onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Search by item name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <div className="flex items-center gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto hidden sm:flex">
                Show Columns
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {table
                .getAllColumns()
                .filter(
                    (column) => column.getCanHide()
                )
                .map((column) => {
                     const columnMap: Record<string, string> = {
                        name: "Item Name",
                        customerName: "Customer",
                        total: "Order Qty",
                        produced: "Production Progress",
                        status: "Status",
                    }
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {columnMap[column.id] ?? column.id}
                    </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
            </DropdownMenu>
            </div>
        </div>
        <div className="rounded-md border hidden md:block">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No items to produce.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>

        <div className="grid gap-4 md:hidden">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const item = row.original;
              const NameCell = columns.find(c => c.accessorKey === 'name')?.cell;
              const CustomerCell = columns.find(c => c.accessorKey === 'customerName')?.cell;
              const ProgressCell = columns.find(c => c.accessorKey === 'produced')?.cell;
              const StatusCell = columns.find(c => c.accessorKey === 'status')?.cell;

              return (
              <Card key={row.id}>
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 text-primary font-semibold">
                      {NameCell && flexRender(NameCell, { row } as any)}
                    </div>
                    {StatusCell && flexRender(StatusCell, { row } as any)}
                  </div>
                  <div>
                    {CustomerCell && flexRender(CustomerCell, { row } as any)}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Progress</div>
                     {ProgressCell && flexRender(ProgressCell, { row } as any)}
                  </div>
                </CardContent>
              </Card>
            )})
          ) : (
            <div className="text-center py-10 text-muted-foreground">No items to produce.</div>
          )}
        </div>


        <div className="flex items-center justify-end space-x-2 py-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>
      </div>
    </div>
  )
}
