
import { getPurchaseOrders } from "@/lib/actions/purchase-orders";
import { columns } from "@/components/purchase-orders/columns";
import { DataTable } from "@/components/purchase-orders/data-table";

export default async function PurchaseOrdersPage() {
  const purchaseOrders = await getPurchaseOrders();

  return (
    <div className="flex-1 flex-col space-y-8 flex">
       <div className="flex items-center justify-between space-y-2">
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
