
import { getProductionItems } from "@/lib/actions/production";
import { columns } from "@/components/production/columns";
import { DataTable } from "@/components/production/data-table";

export default async function ProductionPage() {
  const productionItems = await getProductionItems();

  return (
    <div className="flex-1 flex-col space-y-8 flex">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Production List</h2>
          <p className="text-muted-foreground">
            Here is a list of all items that need to be produced from active POs.
          </p>
        </div>
      </div>
      <DataTable data={productionItems} columns={columns} />
    </div>
  );
}
