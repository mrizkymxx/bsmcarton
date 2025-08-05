
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
import dynamic from "next/dynamic"

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
import { Card, CardContent } from "../ui/card"
import { Customer } from "@/lib/types"
import { Skeleton } from "../ui/skeleton"

const CustomerForm = dynamic(() => import("./customer-form").then(mod => mod.CustomerForm), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});

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

  return (
    <div className="w-full">
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
        
        {/* Desktop View */}
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

        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => {
                  const customer = row.original;
                  const ActionsCell = columns.find(c => c.id === 'actions')?.cell;
                  return (
                    <Card key={row.id} data-state={row.getIsSelected() && "selected"}>
                        <CardContent className="p-4 flex flex-col gap-2">
                           <div className="flex justify-between items-start">
                                <div className="font-medium text-primary">
                                     {customer.name}
                                </div>
                                {ActionsCell && flexRender(ActionsCell, { row } as any)}
                           </div>
                           <dl className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-start">
                                    <dt className="w-16 font-semibold text-foreground shrink-0">Address</dt>
                                    <dd className="flex-1 font-semibold">: {customer.address}</dd>
                                </div>
                                <div className="flex items-start">
                                    <dt className="w-16 font-semibold text-foreground shrink-0">Email</dt>
                                    <dd className="flex-1 font-semibold">: {customer.email}</dd>
                                </div>
                                <div className="flex items-start">
                                    <dt className="w-16 font-semibold text-foreground shrink-0">Phone</dt>
                                    <dd className="flex-1 font-semibold">: {customer.phone}</dd>
                                </div>
                           </dl>
                        </CardContent>
                    </Card>
                  )
                })
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
