
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
          <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">Jumlah pelanggan terdaftar</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total PO Aktif</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activePOCount}</div>
          <p className="text-xs text-muted-foreground">PO dengan status "Open"</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Item Siap Kirim</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{readyToShipCount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total pcs dari semua PO aktif</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengiriman Bulan Ini</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveriesThisMonth}</div>
          <p className="text-xs text-muted-foreground">Jumlah surat jalan bulan ini</p>
        </CardContent>
      </Card>
    </div>
  );
}
