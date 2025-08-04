
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Truck, Boxes } from 'lucide-react';

interface StatsCardsProps {
    totalCustomers: number;
    activePOCount: number;
    readyToShipCount: number;
    deliveriesThisMonth: number;
}

export function StatsCards({ 
    totalCustomers,
    activePOCount,
    readyToShipCount,
    deliveriesThisMonth 
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">Number of registered customers</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total POs</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activePOCount}</div>
          <p className="text-xs text-muted-foreground">Total unfinished POs</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Not Shipped</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{readyToShipCount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total pcs from all active POs</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Deliveries This Month</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveriesThisMonth}</div>
          <p className="text-xs text-muted-foreground">Number of delivery notes this month</p>
        </CardContent>
      </Card>
    </div>
  );
}
