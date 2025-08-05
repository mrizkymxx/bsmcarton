
import { getProductionItems } from "@/lib/actions/production";
import { columns } from "@/components/production/columns";
import { DataTable } from "@/components/production/data-table";
import AppLayout from "@/components/layout/app-layout";

async function ProductionContent() {
  const productionItems = await getProductionItems();

  return (
    <div className="flex flex-col gap-4 w-full">
       <div className="flex items-center justify-between">
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


export default async function ProductionPage() {
    return (
        <AppLayout>
            <ProductionContent />
        </AppLayout>
    )
}
