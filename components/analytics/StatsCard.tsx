'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
    color?: string;
    delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    description,
    color = "blue",
    delay = 0
}) => {
    const colorClasses = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        green: "bg-green-500/10 text-green-500 border-green-500/20",
        orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${selectedColor}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </div>
                )}
            </div>

            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <div className="text-3xl font-serif font-medium text-white mb-2">{value}</div>
            {description && (
                <p className="text-xs text-gray-500">{description}</p>
            )}
        </motion.div>
    );
};
