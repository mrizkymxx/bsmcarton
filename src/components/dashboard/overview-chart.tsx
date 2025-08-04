

"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Delivery, PurchaseOrder } from '@/lib/types';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface OverviewChartProps {
    orders: PurchaseOrder[];
    deliveries: Delivery[];
}

const processChartData = (orders: PurchaseOrder[], deliveries: Delivery[], year: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dataByMonth: { [key: string]: { ordered: number, delivered: number } } = {};

    // Initialize all months of the current year
    for (let i = 0; i < 12; i++) {
        const date = new Date(year, i, 1);
        const monthName = monthNames[date.getMonth()];
        dataByMonth[monthName] = { ordered: 0, delivered: 0 };
    }

    orders.forEach(order => {
        const orderDate = new Date(order.orderDate);
        if (orderDate.getFullYear() === year) {
            const month = monthNames[orderDate.getMonth()];
            const totalItems = order.items.reduce((sum, item) => sum + item.total, 0);
            if (dataByMonth[month]) {
                dataByMonth[month].ordered += totalItems;
            }
        }
    });

    deliveries.forEach(delivery => {
        const deliveryDate = new Date(delivery.deliveryDate);
        if (deliveryDate.getFullYear() === year) {
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

const chartConfig = {
    Dipesan: {
        label: "Dipesan",
        color: "hsl(var(--chart-1))",
    },
    Terkirim: {
        label: "Terkirim",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;


const OverviewChart = ({ orders, deliveries }: OverviewChartProps) => {
    const currentYear = new Date().getFullYear();
    const data = processChartData(orders, deliveries, currentYear);
    
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
                        content={<ChartTooltipContent 
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />}
                    />
                    <Bar dataKey="Dipesan" fill="var(--color-Dipesan)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Terkirim" fill="var(--color-Terkirim)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default OverviewChart;
