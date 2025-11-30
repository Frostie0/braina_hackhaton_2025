'use client';

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { colors } from '@/lib/colors';

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
        color: colors.accent,
    },
} satisfies ChartConfig

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
    data,
    title,
    subtitle,
    color = colors.accent // Use accent purple as default
}) => {
    const chartData = data.map(d => ({
        ...d,
        fill: color
    }));

    return (
        <div className=" border border-white/10 rounded-2xl p-6 transition-all duration-300">
            <div className="mb-6">
                <h3 className="text-lg font-serif font-medium text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>

            <ChartContainer config={chartConfig} className="min-h-[200px] w-full bg-none hover:bg-none">
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
                        domain={[0, 20]}
                    />
                    <ChartTooltip
                        cursor={{
                            fill: 'rgba(139, 92, 246, 0.1)',
                            radius: 4
                        }}
                        content={<ChartTooltipContent
                            hideLabel
                            className="!bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20"
                        />}
                    />
                    <Bar
                        dataKey="value"
                        fill={color}
                        radius={[8, 8, 0, 0]}
                        barSize={40}
                        className="transition-all duration-300"
                    />
                </BarChart>
            </ChartContainer>
        </div>
    );
};
