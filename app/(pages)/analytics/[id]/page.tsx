'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, AlertCircle, CheckCircle2, XCircle, ArrowLeft, Share2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { StatsCard } from '@/components/analytics/StatsCard';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { ImprovementTips } from '@/components/analytics/ImprovementTips';

// Mock Data for specific exam
const EXAM_STATS = {
    title: 'Examen de Mathématiques - BACC',
    date: '29 Nov 2025',
    score: 16,
    totalQuestions: 20,
    timeSpent: '2h 15m',
    averageClassScore: 12.5,
    questionsBreakdown: [
        { id: 1, isCorrect: true, topic: 'Algèbre' },
        { id: 2, isCorrect: true, topic: 'Algèbre' },
        { id: 3, isCorrect: false, topic: 'Géométrie' },
        { id: 4, isCorrect: true, topic: 'Analyse' },
        { id: 5, isCorrect: true, topic: 'Analyse' },
        { id: 6, isCorrect: false, topic: 'Proba' },
        { id: 7, isCorrect: true, topic: 'Algèbre' },
        { id: 8, isCorrect: true, topic: 'Géométrie' },
        { id: 9, isCorrect: true, topic: 'Analyse' },
        { id: 10, isCorrect: false, topic: 'Analyse' },
        // ... more questions
    ],
    topicPerformance: [
        { label: 'Algèbre', value: 18 },
        { label: 'Géométrie', value: 14 },
        { label: 'Analyse', value: 15 },
        { label: 'Probabilités', value: 10 },
    ],
    tips: [
        {
            title: 'Revoir les Probabilités',
            description: 'Vous avez manqué plusieurs questions sur les probabilités conditionnelles. C\'est un sujet récurrent au BACC.',
            type: 'specific' as const
        },
        {
            title: 'Attention aux détails en Analyse',
            description: 'Vos erreurs en analyse semblent être des erreurs de calcul plutôt que de compréhension. Prenez le temps de vérifier vos étapes.',
            type: 'warning' as const
        }
    ]
};

export default function ExamAnalyticsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // Calculate derived stats
    const correctCount = EXAM_STATS.questionsBreakdown.filter(q => q.isCorrect).length;
    const accuracy = Math.round((correctCount / EXAM_STATS.questionsBreakdown.length) * 100);

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl lg:text-3xl font-serif font-medium">{EXAM_STATS.title}</h1>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                                    COMPLÉTÉ
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">Passé le {EXAM_STATS.date} • ID: {id}</p>
                        </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                        <Share2 className="w-5 h-5" />
                    </button>
                </header>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatsCard
                        title="Votre Score"
                        value={`${EXAM_STATS.score}/20`}
                        icon={TrendingUp}
                        trend={{ value: 15, isPositive: true }} // vs average
                        description={`Moyenne de la classe : ${EXAM_STATS.averageClassScore}/20`}
                        color="blue"
                    />
                    <StatsCard
                        title="Précision"
                        value={`${accuracy}%`}
                        icon={CheckCircle2}
                        color="green"
                        delay={0.1}
                    />
                    <StatsCard
                        title="Temps Passé"
                        value={EXAM_STATS.timeSpent}
                        icon={Clock}
                        color="orange"
                        delay={0.2}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Topic Performance Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <PerformanceChart
                                data={EXAM_STATS.topicPerformance}
                                title="Performance par Sujet"
                                subtitle="Analyse de vos points forts et faibles sur cet examen"
                                color="bg-blue-500"
                            />
                        </motion.div>

                        {/* Question Breakdown Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6"
                        >
                            <h3 className="text-lg font-serif font-medium text-white mb-6">Détail des Questions</h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                                {EXAM_STATS.questionsBreakdown.map((q, i) => (
                                    <div
                                        key={i}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold border ${q.isCorrect
                                                ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                                                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                            } transition-colors cursor-pointer group relative`}
                                    >
                                        {i + 1}
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-normal py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                            {q.topic}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-6 mt-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    Correct
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    Incorrect
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <ImprovementTips tips={EXAM_STATS.tips} />
                        </motion.div>

                        {/* Action Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-center"
                        >
                            <h3 className="text-xl font-serif font-medium text-white mb-2">Besoin de pratique ?</h3>
                            <p className="text-blue-100 text-sm mb-6">Générez un quiz ciblé sur vos erreurs pour vous améliorer rapidement.</p>
                            <button className="w-full py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                                Générer un Quiz de Rattrapage
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
