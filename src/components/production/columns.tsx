
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ProductionItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "../ui/progress"


export const columns: ColumnDef<ProductionItem>[] = [
  {
    accessorKey: "name",
    header: "Item Name",
    cell: ({row}) => {
        const item = row.original;
        return (
            <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                    {item.finishedSize ? (item.type === 'Box' ? `${item.finishedSize.length}x${item.finishedSize.width}x${item.finishedSize.height} cm` : `${item.finishedSize.length}x${item.finishedSize.width} cm`) : '-'}
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "customerName",
    header: "Customer",
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
    header: "Order Qty",
    cell: ({row}) => {
      const item = row.original;
      return <span>{item.total.toLocaleString()}</span>
    }
  },
  {
    accessorKey: "produced",
    header: "Production Progress",
    cell: ({ row }) => {
      const item = row.original;
      const delivered = item.delivered || 0;
      const notDelivered = item.produced - delivered;
      const progress = item.total > 0 ? (delivered / item.total) * 100 : 0;
      
      return (
        <div className="flex flex-col gap-1.5 w-48">
           <Progress value={progress} className="h-2" />
           <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not Shipped: {notDelivered.toLocaleString()}</span>
                <span>Shipped: {delivered.toLocaleString()}</span>
           </div>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const item = row.original;
      const delivered = item.delivered || 0;
      
      const isCompleted = delivered >= item.total;
      const status = isCompleted ? "Completed" : "In Progress";
      const variant = isCompleted ? "default" : "secondary";

      return <Badge variant={variant}>{status}</Badge>
    }
  },
]
