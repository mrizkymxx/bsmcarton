
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Delivery, DeliveryItem } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const renderItems = (items: DeliveryItem[]) => {
    if (!items || items.length === 0) {
        return <span>-</span>;
    }
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="p-0 hover:no-underline text-left">
                   {items.length} Item
                   <br />
                   <span className="text-muted-foreground font-normal">
                       Total: {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} pcs
                   </span>
                </AccordionTrigger>
                <AccordionContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Item</TableHead>
                                <TableHead>No. PO</TableHead>
                                <TableHead>Jumlah</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(item => (
                                <TableRow key={item.orderItemId}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.poNumber}</TableCell>
                                    <TableCell>{item.quantity.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export const columns: ColumnDef<Delivery>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Pilih semua"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Pilih baris"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "deliveryNoteNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. Surat Jalan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "customerName",
    header: "Nama Pelanggan",
  },
  {
    accessorKey: "deliveryDate",
    header: "Tanggal Kirim",
     cell: ({ row }) => {
      const date = new Date(row.getValue("deliveryDate"))
      const formatted = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "vehicleNumber",
    header: "No. Kendaraan"
  },
  {
    accessorKey: "items",
    header: "Detail Item",
    cell: ({ row }) => renderItems(row.original.items),
  },
]
