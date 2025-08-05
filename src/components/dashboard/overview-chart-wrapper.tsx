
"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Delivery, PurchaseOrder } from '@/lib/types';

const OverviewChart = dynamic(() => import('@/components/dashboard/overview-chart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[350px] w-full" />,
});

interface OverviewChartWrapperProps {
  orders: PurchaseOrder[];
  deliveries: Delivery[];
}

export default function OverviewChartWrapper({ orders, deliveries }: OverviewChartWrapperProps) {
  return <OverviewChart orders={orders} deliveries={deliveries} />;
}
