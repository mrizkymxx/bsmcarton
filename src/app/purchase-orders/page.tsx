
import { getPurchaseOrders } from "@/lib/actions/purchase-orders";
import { columns } from "@/components/purchase-orders/columns";
import { DataTable } from "@/components/purchase-orders/data-table";

export default async function PurchaseOrdersPage() {
  const purchaseOrders = await getPurchaseOrders();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-4 md:p-8 flex">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchase Orders</h2>
          <p className="text-muted-foreground">
            Berikut adalah daftar semua purchase order yang masuk.
          </p>
        </div>
      </div>
      <DataTable data={purchaseOrders} columns={columns} />
    </div>
  );
}
