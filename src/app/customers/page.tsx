
import { getCustomers } from "@/lib/actions/customers";
import { columns } from "@/components/customers/columns";
import { DataTable } from "@/components/customers/data-table";
import AppLayout from "@/components/layout/app-layout";

async function CustomersContent() {
  const customers = await getCustomers();

  return (
    <div className="flex flex-col gap-4 w-full">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer List</h2>
          <p className="text-muted-foreground">
            Here is a list of all registered customers.
          </p>
        </div>
      </div>
      <DataTable data={customers} columns={columns} />
    </div>
  );
}


export default async function CustomersPage() {
    return (
        <AppLayout>
            <CustomersContent />
        </AppLayout>
    )
}
