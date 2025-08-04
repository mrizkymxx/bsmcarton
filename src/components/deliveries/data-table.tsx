
"use client"

import * as React from "react"
import {
  ColumnDef,
  FilterFn,
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
import { DeliveryForm } from "./delivery-form"
import { Delivery } from "@/lib/types"
import { Card, CardContent } from "../ui/card"


interface DataTableProps<TData extends Delivery, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const customGlobalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    const searchTerm = String(filterValue).toLowerCase();

    // Check top-level properties
    const deliveryNoteNumber = row.original.deliveryNoteNumber?.toLowerCase() || '';
    const customerName = row.original.customerName?.toLowerCase() || '';
    if (deliveryNoteNumber.includes(searchTerm) || customerName.includes(searchTerm)) {
        return true;
    }

    // Check nested items
    const items = row.original.items;
    if (items && items.length > 0) {
        return items.some((item: any) => {
            const poNumber = item.poNumber?.toLowerCase() || '';
            const sizeString = item.finishedSize
                ? item.type === 'Box'
                    ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height}`.toLowerCase()
                    : `${item.finishedSize.length}x${item.finishedSize.width}`.toLowerCase()
                : '';
            
            return poNumber.includes(searchTerm) || sizeString.includes(searchTerm);
        });
    }

    return false;
};


export function DataTable<TData extends Delivery, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
        id: "deliveryNoteNumber",
        desc: true,
    }
  ])
  const [globalFilter, setGlobalFilter] = React.useState('')
   const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
    
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const router = useRouter();


  const table = useReactTable({
    data,
    columns,
    globalFilterFn: customGlobalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
     onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
  })
  
  const getVisibleColumns = () => columns.filter(c => c.id !== 'select' && c.id !== 'actions');
  const mainColumn = getVisibleColumns().find(c => c.accessorKey === 'deliveryNoteNumber') || getVisibleColumns()[0];
  const itemsColumn = columns.find(c => c.accessorKey === 'items');
  const actionsColumn = columns.find(c => c.id === 'actions');

  return (
    <div>
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Search by note no, customer, PO no, size..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
            />
            <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary-glow">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Delivery Note
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                  <DialogTitle>Create New Delivery Note</DialogTitle>
                  <DialogDescription>
                      Fill in the delivery note details below. Available items are those with 'Ready to Ship' status.
                  </DialogDescription>
                  </DialogHeader>
                  <DeliveryForm onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    router.refresh();
                  }} />
              </DialogContent>
            </Dialog>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto hidden md:flex">
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
                        deliveryNoteNumber: "Delivery Note No.",
                        customerName: "Customer Name",
                        deliveryDate: "Delivery Date",
                        vehicleNumber: "Vehicle No.",
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
                    No delivery data.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="space-y-4 md:hidden">
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                    <Card key={row.id} data-state={row.getIsSelected() && "selected"}>
                        <CardContent className="p-4 space-y-2">
                           <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    {mainColumn && mainColumn.cell && flexRender(mainColumn.cell, { row } as any)}
                                    <div className="text-sm text-muted-foreground">{row.original.customerName}</div>
                                </div>
                                {actionsColumn && actionsColumn.cell && flexRender(actionsColumn.cell, { row } as any)}
                           </div>
                           <div>
                            {itemsColumn && itemsColumn.cell && flexRender(itemsColumn.cell, { row } as any)}
                           </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                 <div className="text-center py-10 text-muted-foreground">No delivery data.</div>
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
