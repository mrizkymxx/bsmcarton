
import { getDeliveries } from "@/lib/actions/deliveries";
import { columns } from "@/components/deliveries/columns";
import { DataTable } from "@/components/deliveries/data-table";

export default async function DeliveriesPage() {
  const deliveries = await getDeliveries();

  return (
    <div className="flex-1 flex-col space-y-8 flex">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Deliveries</h2>
          <p className="text-muted-foreground">
            List of all created delivery notes.
          </p>
        </div>
      </div>
      <DataTable data={deliveries} columns={columns} />
    </div>
  );
}
