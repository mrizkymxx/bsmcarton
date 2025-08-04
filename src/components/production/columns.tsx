
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
import { ProductionItem } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ProductionForm } from "./production-form"
import { Progress } from "../ui/progress"

function ActionsCell({ item }: { item: ProductionItem }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Progres Produksi</DialogTitle>
            <DialogDescription>
              Perbarui jumlah yang sudah diproduksi untuk item ini.
            </DialogDescription>
          </DialogHeader>
          <ProductionForm
            item={item}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Update Progress</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns: ColumnDef<ProductionItem>[] = [
  {
    accessorKey: "name",
    header: "Nama Item",
    cell: ({row}) => {
        const item = row.original;
        return (
            <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                    {item.type === 'Box' ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height} cm` : `${item.finishedSize.length}x${item.finishedSize.width} cm`}
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "customerName",
    header: "Pelanggan",
     cell: ({row}) => {
        const item = row.original;
        return (
            <div>
                <div className="font-medium">{item.customerName}</div>
                <div className="text-xs text-muted-foreground">PO: {item.poNumber}</div>
            </div>
        )
    }
  },
  {
    accessorKey: "total",
    header: "Jumlah Pesan",
    cell: ({row}) => {
      const item = row.original;
      return <span>{item.total.toLocaleString()}</span>
    }
  },
  {
    accessorKey: "produced",
    header: "Progres Produksi",
    cell: ({ row }) => {
      const item = row.original;
      const delivered = item.delivered || 0;
      const notDelivered = item.produced - delivered;
      const progress = item.total > 0 ? (delivered / item.total) * 100 : 0;
      return (
        <div className="flex flex-col gap-1.5 w-48">
           <Progress value={progress} className="h-2" />
           <div className="flex justify-between text-xs text-muted-foreground">
                <span>Belum Dikirim: {notDelivered.toLocaleString()}</span>
                <span>Terkirim: {delivered.toLocaleString()}</span>
           </div>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status:any = row.getValue("status") as string;
      let variant: "default" | "secondary" | "outline" | "destructive" = "outline";
        switch (status) {
            case 'Siap Kirim':
                variant = 'secondary';
                break;
            case 'Dikirim':
                variant = 'default';
                break;
             case 'Diproduksi':
                variant = 'default';
                break;
            default:
                variant = 'outline';
        }
      return <Badge variant={variant}>{status}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
]
