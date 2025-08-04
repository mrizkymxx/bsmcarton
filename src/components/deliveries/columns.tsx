
"use client"

import { ColumnDef, FilterFn } from "@tanstack/react-table"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { deleteDelivery } from "@/lib/actions/deliveries"

function ActionsCell({ delivery }: { delivery: Delivery }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteDelivery(delivery.id);
      toast({
        title: "Sukses",
        description: "Surat Jalan berhasil dihapus.",
      });
      router.refresh();
    } catch (error: any) {
       toast({
        title: "Error",
        description: error.message || "Gagal menghapus Surat Jalan.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus Surat Jalan dan mengembalikan jumlah item ke stok produksi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem disabled>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}


const renderItems = (items: DeliveryItem[]) => {
    if (!items || items.length === 0) {
        return <span>-</span>;
    }
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="py-1 hover:no-underline text-left flex flex-col items-start">
                   <span className="font-medium">{items.length} Tipe Item</span>
                   <span className="text-muted-foreground font-normal text-xs">
                       Total: {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} pcs
                   </span>
                </AccordionTrigger>
                <AccordionContent>
                    <Table className="my-2">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Item</TableHead>
                                <TableHead>No. PO</TableHead>
                                <TableHead className="text-right">Jumlah</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={`${item.orderItemId}-${index}`}>
                                    <TableCell className="py-2">
                                      <div className="font-medium">{item.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                          {item.finishedSize
                                            ? item.type === 'Box'
                                              ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height} cm`
                                              : `${item.finishedSize.length}x${item.finishedSize.width} cm`
                                            : '-'}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-2">{item.poNumber}</TableCell>
                                    <TableCell className="py-2 text-right">{item.quantity.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const customGlobalFilterFn: FilterFn<Delivery> = (row, columnId, filterValue) => {
    const searchTerm = String(filterValue).toLowerCase();

    const deliveryNoteNumber = row.original.deliveryNoteNumber?.toLowerCase() || '';
    const customerName = row.original.customerName?.toLowerCase() || '';
    
    if (deliveryNoteNumber.includes(searchTerm) || customerName.includes(searchTerm)) {
        return true;
    }

    const items = row.original.items;
    if (items && items.length > 0) {
        return items.some(item => {
            const poNumber = item.poNumber.toLowerCase();
            const sizeString = item.finishedSize
                ? item.type === 'Box'
                    ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height}`
                    : `${item.finishedSize.length}x${item.finishedSize.width}`
                : '';
            
            return poNumber.includes(searchTerm) || sizeString.includes(searchTerm);
        });
    }

    return false;
};


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
    cell: ({ row }) => <div className="font-mono">{row.getValue("deliveryNoteNumber")}</div>,
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
      return <div className="font-medium whitespace-nowrap">{formatted}</div>
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
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell delivery={row.original} />,
  },
]
