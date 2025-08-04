
'use client';

import { PurchaseOrder, Delivery } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const OverviewChartClient = dynamic(
  () => import('./overview-chart-client').then((mod) => mod.OverviewChartClient),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[350px] w-full" />,
  }
);

interface OverviewChartProps {
  orders: PurchaseOrder[];
  deliveries: Delivery[];
}

export function OverviewChart({ orders, deliveries }: OverviewChartProps) {
  return <OverviewChartClient orders={orders} deliveries={deliveries} />;
}
