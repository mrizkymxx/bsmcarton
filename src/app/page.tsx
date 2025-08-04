
import { StatsCards } from '@/components/dashboard/stats-cards';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getPurchaseOrders } from '@/lib/actions/purchase-orders';
import { getCustomers } from '@/lib/actions/customers';
import { getDeliveries } from '@/lib/actions/deliveries';

export default async function Dashboard() {
  const purchaseOrders = await getPurchaseOrders();
  const customers = await getCustomers();
  const deliveries = await getDeliveries();

  const activePOCount = purchaseOrders.filter(po => po.status === 'Open').length;
  
  const readyToShipCount = purchaseOrders
    .filter(po => po.status === 'Open')
    .flatMap(po => po.items)
    .reduce((sum, item) => {
        const available = (item.produced || 0) - (item.delivered || 0);
        return sum + (available > 0 ? available : 0);
    }, 0);

  const deliveriesThisMonth = deliveries.filter(d => {
    const deliveryDate = new Date(d.deliveryDate);
    const now = new Date();
    return deliveryDate.getMonth() === now.getMonth() && deliveryDate.getFullYear() === now.getFullYear();
  }).length;
  
  const recentPOs = purchaseOrders.slice(0, 5);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <StatsCards 
          totalCustomers={customers.length}
          activePOCount={activePOCount}
          readyToShipCount={readyToShipCount}
          deliveriesThisMonth={deliveriesThisMonth}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Ringkasan Produksi</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <OverviewChart orders={purchaseOrders} deliveries={deliveries} />
            </CardContent>
          </Card>
          <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Purchase Order Terbaru</CardTitle>
              <CardDescription>
                Daftar 5 PO terakhir yang masuk.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPOs.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell>
                        <div className="font-medium">{po.customerName}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {po.poNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{po.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(po.orderDate).toLocaleDateString('id-ID')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
