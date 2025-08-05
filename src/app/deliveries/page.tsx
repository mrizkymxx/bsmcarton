
import { getDeliveries } from "@/lib/actions/deliveries";
import { columns } from "@/components/deliveries/columns";
import { DataTable } from "@/components/deliveries/data-table";
import AppLayout from "@/components/layout/app-layout";

async function DeliveriesContent() {
  const deliveries = await getDeliveries();

  return (
    <div className="flex flex-col gap-4 w-full">
       <div className="flex items-center justify-between">
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

export default async function DeliveriesPage() {
    return (
        <AppLayout>
            <DeliveriesContent />
        </AppLayout>
    )
}
