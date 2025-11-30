'use client';

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, LabelList, CartesianGrid } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { colors } from '@/lib/colors';

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
        color: colors.accent,
    },
} satisfies ChartConfig

export const SubjectMasteryChart: React.FC<SubjectMasteryChartProps> = ({ data }) => {
    // Sort by mastery descending - use accent purple with varying opacity
    const sortedData = [...data].sort((a, b) => b.mastery - a.mastery).map(d => ({
        ...d,
        fill: d.mastery >= 80 ? '#8B5CF6' : // accent purple full
            d.mastery >= 65 ? '#A78BFA' : // purple-400
                d.mastery >= 50 ? '#C4B5FD' : // purple-300
                    '#DDD6FE' // purple-200
    }));

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300">
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
                        cursor={{
                            fill: 'rgba(139, 92, 246, 0.1)',
                            radius: 4
                        }}
                        content={<ChartTooltipContent
                            hideLabel
                            className="!bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20"
                        />}
                    />
                    <Bar dataKey="mastery" radius={8} barSize={24} className="transition-all duration-300">
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
