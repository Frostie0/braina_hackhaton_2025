'use client';

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, LabelList, CartesianGrid } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SubjectData {
    subject: string;
    mastery: number; // 0-100
    examsCount: number;
}

interface SubjectMasteryChartProps {
    data: SubjectData[];
}

const chartConfig = {
    mastery: {
        label: "Maîtrise (%)",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export const SubjectMasteryChart: React.FC<SubjectMasteryChartProps> = ({ data }) => {
    // Sort by mastery descending
    const sortedData = [...data].sort((a, b) => b.mastery - a.mastery).map(d => ({
        ...d,
        fill: d.mastery >= 80 ? '#22c55e' : // green-500
            d.mastery >= 50 ? '#3b82f6' : // blue-500
                d.mastery >= 30 ? '#f97316' : // orange-500
                    '#ef4444' // red-500
    }));

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-serif font-medium text-white mb-6">Maîtrise par Matière</h3>

            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart
                    accessibilityLayer
                    data={sortedData}
                    layout="vertical"
                    margin={{
                        left: 0,
                    }}
                >
                    <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.1)" />
                    <YAxis
                        dataKey="subject"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }}
                        width={100}
                    />
                    <XAxis dataKey="mastery" type="number" hide domain={[0, 100]} />
                    <ChartTooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="mastery" radius={5} barSize={24}>
                        <LabelList
                            dataKey="mastery"
                            position="right"
                            offset={8}
                            className="fill-white font-bold"
                            fontSize={12}
                            formatter={(value: any) => `${value}%`}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </div>
    );
};
