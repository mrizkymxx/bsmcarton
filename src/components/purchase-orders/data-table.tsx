
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
import { useRouter } from "next/navigation"

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
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PurchaseOrderForm } from "./po-form"
import { PurchaseOrder } from "@/lib/types"
import { Card, CardContent } from "../ui/card"

interface DataTableProps<TData extends PurchaseOrder, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends PurchaseOrder, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
   const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const router = useRouter();

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
  
  const getVisibleColumns = () => columns.filter(c => c.id !== 'select' && c.id !== 'actions');
  const mainColumn = getVisibleColumns().find(c => c.accessorKey === 'poNumber') || getVisibleColumns()[0];
  const orderDateColumn = columns.find(c => c.accessorKey === 'orderDate');
  const statusColumn = columns.find(c => c.accessorKey === 'status');
  const itemsColumn = columns.find(c => c.accessorKey === 'items');
  const actionsColumn = columns.find(c => c.id === 'actions');

  return (
    <div>
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Search by PO number..."
            value={(table.getColumn("poNumber")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("poNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary-glow">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add PO
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                  <DialogTitle>Add New Purchase Order</DialogTitle>
                  <DialogDescription>
                      Fill in the PO details below. Click save when you're done.
                  </DialogDescription>
                  </DialogHeader>
                  <PurchaseOrderForm onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    router.refresh();
                  }} />
              </DialogContent>
            </Dialog>
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
                        poNumber: "PO Number",
                        customerName: "Customer Name",
                        orderDate: "Order Date",
                        status: "Status",
                        items: "Item Details",
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
        <div className="rounded-md border hidden sm:block">
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
                    No purchase order data.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        
        <div className="space-y-4 sm:hidden">
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                    <Card key={row.id} data-state={row.getIsSelected() && "selected"}>
                        <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="font-semibold">{row.original.poNumber}</div>
                                    <div className="text-sm text-muted-foreground">{row.original.customerName}</div>
                                </div>
                                {actionsColumn && actionsColumn.cell && flexRender(actionsColumn.cell, { row } as any)}
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                {orderDateColumn && orderDateColumn.cell && flexRender(orderDateColumn.cell, { row } as any)}
                                {statusColumn && statusColumn.cell && flexRender(statusColumn.cell, { row } as any)}
                            </div>
                            <div>
                                {itemsColumn && itemsColumn.cell && flexRender(itemsColumn.cell, { row } as any)}
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                 <div className="text-center py-10 text-muted-foreground">No purchase order data.</div>
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
