'use client';

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DataPoint {
    label: string;
    value: number;
    date?: string;
}

interface PerformanceChartProps {
    data: DataPoint[];
    title: string;
    subtitle?: string;
    color?: string;
}

const chartConfig = {
    score: {
        label: "Score",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
    data,
    title,
    subtitle,
    color = "#f97316" // Default orange-500
}) => {
    // Transform data for Recharts if needed, but DataPoint structure is compatible
    // We just need to ensure keys match
    const chartData = data.map(d => ({
        ...d,
        fill: color // Allow dynamic coloring per chart instance if needed
    }));

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="mb-6">
                <h3 className="text-lg font-serif font-medium text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>

            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis
                        hide
                        domain={[0, 20]} // Assuming scores are out of 20
                    />
                    <ChartTooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                        dataKey="value"
                        fill={color}
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
};
