'use client';

import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

interface Tip {
    title: string;
    description: string;
    type: 'general' | 'specific' | 'warning';
}

interface ImprovementTipsProps {
    tips: Tip[];
}

export const ImprovementTips: React.FC<ImprovementTipsProps> = ({ tips }) => {
    return (
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                    <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-medium text-white">Conseils d'Amélioration</h3>
            </div>

            <div className="space-y-4">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                        <h4 className="text-orange-200 font-medium mb-1 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3" />
                            {tip.title}
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed pl-5">
                            {tip.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
