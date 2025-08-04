
"use client"

import { ColumnDef, FilterFn } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Delivery, DeliveryItem, Customer } from "@/lib/types"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useTransition } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { deleteDelivery } from "@/lib/actions/deliveries"
import { generateDeliveryNotePDF } from "@/lib/pdf"
import { getCustomers } from "@/lib/actions/customers"

function ActionsCell({ delivery }: { delivery: Delivery }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPrinting, startPrinting] = useTransition();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteDelivery(delivery.id);
      toast({
        title: "Success",
        description: "Delivery Note has been successfully deleted.",
      });
      router.refresh();
    } catch (error: any) {
       toast({
        title: "Error",
        description: error.message || "Failed to delete Delivery Note.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };
  
  const handlePrint = async () => {
    startPrinting(async () => {
      try {
        const allCustomers = await getCustomers();
        const customer = allCustomers.find(c => c.id === delivery.customerId);
        if (!customer) {
            throw new Error("Customer data not found for this delivery.");
        }
        const pdfDataUri = await generateDeliveryNotePDF(delivery, customer);
        setPdfUrl(pdfDataUri);
      } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to generate PDF.",
            variant: "destructive",
          });
      }
    });
  }
  
  return (
    <>
      <Dialog open={!!pdfUrl} onOpenChange={(isOpen) => !isOpen && setPdfUrl(null)}>
        <DialogContent className="max-w-4xl h-[90vh] p-2">
            <DialogHeader className="sr-only">
              <DialogTitle>PDF Preview</DialogTitle>
            </DialogHeader>
          <iframe src={pdfUrl ?? ''} className="w-full h-full border rounded-md" />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the Delivery Note and return the item quantity to the production stock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handlePrint} disabled={isPrinting}>
             <Printer className="mr-2 h-4 w-4" />
            {isPrinting ? 'Generating...' : 'Print / Preview'}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            Delete
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
                   <span className="font-semibold">{items.length} Item Types</span>
                   <span className="text-muted-foreground font-normal text-xs">
                       Total: {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} pcs
                   </span>
                </AccordionTrigger>
                <AccordionContent>
                    <Table className="my-2">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>PO No.</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={`${item.orderItemId}-${index}`}>
                                    <TableCell className="py-2">
                                      <div className="font-semibold">{item.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                          {item.finishedSize
                                            ? item.type === 'Box'
                                              ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height} cm`
                                              : `${item.finishedSize.length}x${item.finishedSize.width} cm`
                                            : '-'}
                                      </div>
                                    </TableCell>
                                    <TableCell className="py-2 font-semibold">{item.poNumber}</TableCell>
                                    <TableCell className="py-2 text-right font-semibold">{item.quantity.toLocaleString()}</TableCell>
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
        aria-label="Select all"
      />
    ),
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
    accessorKey: "deliveryNoteNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-2"
        >
          Delivery Note No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono whitespace-nowrap font-semibold">{row.getValue("deliveryNoteNumber")}</div>,
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("customerName")}</div>,
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date",
     cell: ({ row }) => {
      const date = new Date(row.getValue("deliveryDate"))
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      return <div className="font-semibold whitespace-nowrap">{formatted}</div>
    },
  },
  {
    accessorKey: "vehicleNumber",
    header: "Vehicle No.",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("vehicleNumber")}</div>
  },
  {
    accessorKey: "items",
    header: "Item Details",
    cell: ({ row }) => renderItems(row.original.items),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell delivery={row.original} />,
  },
]
