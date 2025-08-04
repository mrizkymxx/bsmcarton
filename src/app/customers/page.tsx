
import { getCustomers } from "@/lib/actions/customers";
import { columns } from "@/components/customers/columns";
import { DataTable } from "@/components/customers/data-table";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="w-full max-w-7xl mx-auto h-full flex-1 flex-col space-y-8 p-4 md:p-8 flex">
       <div className="flex items-center justify-between space-y-2">
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
