"use client";

import * as React from "react";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Delivery, PurchaseOrder } from "@/lib/types";

const OverviewChartClient = dynamic(
  () => import('@/components/dashboard/overview-chart-client').then(mod => mod.OverviewChartClient),
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
