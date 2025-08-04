
import { getDeliveries } from "@/lib/actions/deliveries";
import { columns } from "@/components/deliveries/columns";
import { DataTable } from "@/components/deliveries/data-table";

export default async function DeliveriesPage() {
  const deliveries = await getDeliveries();

  return (
    <div className="flex flex-col w-full">
       <div className="flex items-center justify-between space-y-2 mb-4">
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
