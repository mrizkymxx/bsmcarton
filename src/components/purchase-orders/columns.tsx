
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PurchaseOrder } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { deletePurchaseOrder } from "@/lib/actions/purchase-orders"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { PurchaseOrderForm } from "./po-form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeliveryForm } from "../deliveries/delivery-form"

function ActionsCell({ po }: { po: PurchaseOrder }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deletePurchaseOrder(po.id);
      toast({
        title: "Success",
        description: "Purchase Order has been successfully deleted.",
      });
      router.refresh();
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to delete purchase order.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
            <DialogDescription>
              Make changes to the PO details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <PurchaseOrderForm
            purchaseOrder={po}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
           <DialogHeader>
              <DialogTitle>Create New Delivery Note</DialogTitle>
              <DialogDescription>
                  Creating a delivery note for PO: <span className="font-semibold text-primary">{po.poNumber}</span>
              </DialogDescription>
            </DialogHeader>
            <DeliveryForm 
              purchaseOrder={po}
              onSuccess={() => {
                setIsDeliveryDialogOpen(false);
                router.refresh();
            }} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the PO data.
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
          <DropdownMenuItem onClick={() => setIsDeliveryDialogOpen(true)}>Create Delivery Note</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit</DropdownMenuItem>
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

export const columns: ColumnDef<PurchaseOrder>[] = [
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
    accessorKey: "poNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PO Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-semibold">{row.getValue("poNumber")}</div>,
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("customerName")}</div>,
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
     cell: ({ row }) => {
      const date = new Date(row.getValue("orderDate"))
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      return <div className="font-semibold">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = status === 'Completed' ? 'secondary' : status === 'Cancelled' ? 'destructive' : 'outline';
      // @ts-ignore
      return <Badge variant={variant}>{status}</Badge>
    }
  },
    {
    accessorKey: "items",
    header: "Item Details",
    cell: ({ row }) => {
      const items = row.original.items;
      if (!items || items.length === 0) {
        return <span>-</span>;
      }
      return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="p-0 hover:no-underline">
                   {items.length} Items
                </AccordionTrigger>
                <AccordionContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Style Name</TableHead>
                                <TableHead>Finished (cm)</TableHead>
                                <TableHead>Material (mm)</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.type}</TableCell>
                                    <TableCell className="font-semibold">{item.name}</TableCell>
                                    <TableCell className="font-semibold">
                                      {item.type === 'Box'
                                          ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height}`
                                          : `${item.finishedSize.length}x${item.finishedSize.width}`
                                      }
                                    </TableCell>
                                    <TableCell className="font-semibold">{`${item.materialSize.length}x${item.materialSize.width}`}</TableCell>
                                    <TableCell className="font-semibold">{item.total}</TableCell>
                                    <TableCell className="max-w-[150px] truncate font-semibold">{item.notes || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell po={row.original} />,
  },
]
