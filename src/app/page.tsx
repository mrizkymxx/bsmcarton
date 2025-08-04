

import { StatsCards } from '@/components/dashboard/stats-cards';
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
import { FileText, Truck } from 'lucide-react';
import OverviewChart from '@/components/dashboard/overview-chart';


type RecentActivity = {
    id: string;
    type: 'PO' | 'Delivery';
    date: string;
    title: string;
    description: string;
};

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
  
  const poActivities: RecentActivity[] = purchaseOrders.map(po => ({
    id: `po-${po.id}`,
    type: 'PO',
    date: po.orderDate,
    title: `New PO: ${po.poNumber}`,
    description: `From: ${po.customerName}`,
  }));

  const deliveryActivities: RecentActivity[] = deliveries.map(d => ({
    id: `delivery-${d.id}`,
    type: 'Delivery',
    date: d.deliveryDate,
    title: `Delivery Note Created: ${d.deliveryNoteNumber}`,
    description: `To: ${d.customerName}`,
  }));

  const recentActivities = [...poActivities, ...deliveryActivities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);


  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <StatsCards 
        totalCustomers={customers.length}
        activePOCount={activePOCount}
        readyToShipCount={readyToShipCount}
        deliveriesThisMonth={deliveriesThisMonth}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Production Summary</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart orders={purchaseOrders} deliveries={deliveries} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>
              List of the last 5 activities (POs & Deliveries).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {activity.type === 'PO' ? 
                          <FileText className="h-4 w-4 text-muted-foreground" /> : 
                          <Truck className="h-4 w-4 text-muted-foreground" />
                        }
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {activity.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(activity.date).toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'})}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
