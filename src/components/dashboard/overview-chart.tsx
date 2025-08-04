"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Delivery, PurchaseOrder } from '@/lib/types';
import { useEffect, useState } from 'react';

interface OverviewChartProps {
    orders: PurchaseOrder[];
    deliveries: Delivery[];
}

const processChartData = (orders: PurchaseOrder[], deliveries: Delivery[]) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dataByMonth: { [key: string]: { ordered: number, delivered: number } } = {};

    // Initialize all months of the current year
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, i, 1);
        const monthName = monthNames[date.getMonth()];
        dataByMonth[monthName] = { ordered: 0, delivered: 0 };
    }

    orders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        if (orderDate.getFullYear() === currentYear) {
            const month = monthNames[orderDate.getMonth()];
            const totalItems = order.items.reduce((sum, item) => sum + item.total, 0);
            if (dataByMonth[month]) {
                dataByMonth[month].ordered += totalItems;
            }
        }
    });

    deliveries.forEach(delivery => {
        const deliveryDate = new Date(delivery.deliveryDate);
        if (deliveryDate.getFullYear() === currentYear) {
            const month = monthNames[deliveryDate.getMonth()];
            const totalItems = delivery.items.reduce((sum, item) => sum + item.quantity, 0);
             if (dataByMonth[month]) {
                dataByMonth[month].delivered += totalItems;
            }
        }
    });

    return Object.entries(dataByMonth).map(([name, values]) => ({
        name,
        Dipesan: values.ordered,
        Terkirim: values.delivered,
    }));
};

export function OverviewChart({ orders, deliveries }: OverviewChartProps) {
    const [data, setData] = useState<any[]>([]);
    
    useEffect(() => {
        setData(processChartData(orders, deliveries));
    }, [orders, deliveries]);
    
    // Render a placeholder if data is not yet processed to avoid layout shifts
    if (data.length === 0) {
        return <div className="w-full h-[350px] bg-muted animate-pulse rounded-lg" />;
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--card))' }}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="Dipesan" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Terkirim" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
