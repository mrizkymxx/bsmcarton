
import { getPurchaseOrders } from "@/lib/actions/purchase-orders";
import { columns } from "@/components/purchase-orders/columns";
import { DataTable } from "@/components/purchase-orders/data-table";

export default async function PurchaseOrdersPage() {
  const purchaseOrders = await getPurchaseOrders();

  return (
    <div className="flex flex-col w-full">
       <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Purchase Orders</h2>
          <p className="text-muted-foreground">
            Here is a list of all incoming purchase orders.
          </p>
        </div>
      </div>
      <DataTable data={purchaseOrders} columns={columns} />
    </div>
  );
}
