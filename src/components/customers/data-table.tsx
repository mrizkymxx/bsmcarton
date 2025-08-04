
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
import { CustomerForm } from "./customer-form"
import { Card, CardContent } from "../ui/card"
import { Customer } from "@/lib/types"

interface DataTableProps<TData extends Customer, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends Customer, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
   const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      email: false,
      phone: false,
    })
    
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
  const mainColumn = getVisibleColumns().find(c => c.accessorKey === 'name') || getVisibleColumns()[0];
  const actionsColumn = columns.find(c => c.id === 'actions');


  return (
    <div>
        <div className="flex items-center justify-between py-4">
            <Input
            placeholder="Search by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary-glow">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                      Fill in the customer details below. Click save when you're done.
                  </DialogDescription>
                  </DialogHeader>
                  <CustomerForm onSuccess={() => {
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
                    return (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                        }
                    >
                        {column.id === 'name' ? 'Customer Name' : column.id}
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
                    No customer data.
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
                                {flexRender(
                                    columns.find(c => c.accessorKey === 'name')?.cell ?? <></>,
                                    { row } as any
                                )}
                                {flexRender(
                                    columns.find(c => c.id === 'actions')?.cell ?? <></>,
                                    { row } as any
                                )}
                            </div>
                            <dl className="text-sm text-muted-foreground">
                                <div className="flex gap-2">
                                    <dt className="w-16 font-semibold text-foreground">Email</dt>
                                    <dd>{row.original.email}</dd>
                                </div>
                                <div className="flex gap-2">
                                    <dt className="w-16 font-semibold text-foreground">Phone</dt>
                                    <dd>{row.original.phone}</dd>
                                </div>
                                <div className="flex gap-2">
                                    <dt className="w-16 font-semibold text-foreground">Address</dt>
                                    <dd className="truncate">{row.original.address}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-10 text-muted-foreground">No customer data.</div>
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
