'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, BookOpen, Target, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StatsCard } from '@/components/analytics/StatsCard';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { SubjectMasteryChart } from '@/components/analytics/SubjectMasteryChart';
import { ImprovementTips } from '@/components/analytics/ImprovementTips';

// Mock Data (à remplacer par des appels API réels)
const GLOBAL_STATS = {
    averageScore: 14.5,
    totalExams: 12,
    totalTime: '18h 30m',
    masteryScore: 72,
    scoreTrend: { value: 12, isPositive: true },
    examsTrend: { value: 3, isPositive: true },
};

const PERFORMANCE_DATA = [
    { label: 'Exam 1', value: 12, date: '01/11' },
    { label: 'Exam 2', value: 10, date: '05/11' },
    { label: 'Exam 3', value: 14, date: '10/11' },
    { label: 'Exam 4', value: 13, date: '15/11' },
    { label: 'Exam 5', value: 16, date: '20/11' },
    { label: 'Exam 6', value: 15, date: '25/11' },
    { label: 'Exam 7', value: 18, date: '29/11' },
];

const SUBJECT_MASTERY = [
    { subject: 'Mathématiques', mastery: 85, examsCount: 4 },
    { subject: 'Physique-Chimie', mastery: 65, examsCount: 3 },
    { subject: 'Histoire-Géo', mastery: 70, examsCount: 3 },
    { subject: 'Philosophie', mastery: 55, examsCount: 2 },
];

const GLOBAL_TIPS = [
    {
        title: 'Renforcez la Philosophie',
        description: 'Vos scores en philosophie sont en dessous de votre moyenne. Essayez de faire plus de flashcards sur les concepts clés.',
        type: 'specific' as const
    },
    {
        title: 'Maintenez le rythme en Maths',
        description: 'Excellent travail en mathématiques ! Continuez à pratiquer des exercices complexes pour viser l\'excellence.',
        type: 'general' as const
    },
    {
        title: 'Gestion du temps',
        description: 'Vous terminez souvent vos examens très rapidement. Prenez le temps de relire vos réponses pour éviter les erreurs d\'inattention.',
        type: 'warning' as const
    }
];

export default function AnalyticsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-medium">Analytics & Performance</h1>
                        <p className="text-gray-400 text-sm mt-1">Suivez votre progression et identifiez vos axes d'amélioration</p>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Moyenne Générale"
                        value={`${GLOBAL_STATS.averageScore}/20`}
                        icon={TrendingUp}
                        trend={GLOBAL_STATS.scoreTrend}
                        color="blue"
                        delay={0}
                    />
                    <StatsCard
                        title="Examens Complétés"
                        value={GLOBAL_STATS.totalExams}
                        icon={BookOpen}
                        trend={GLOBAL_STATS.examsTrend}
                        color="purple"
                        delay={0.1}
                    />
                    <StatsCard
                        title="Temps d'Étude"
                        value={GLOBAL_STATS.totalTime}
                        icon={Clock}
                        color="orange"
                        delay={0.2}
                    />
                    <StatsCard
                        title="Score de Maîtrise"
                        value={`${GLOBAL_STATS.masteryScore}%`}
                        icon={Target}
                        color="green"
                        delay={0.3}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Charts) */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <PerformanceChart
                                data={PERFORMANCE_DATA}
                                title="Évolution des Scores"
                                subtitle="Vos 7 derniers examens"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <SubjectMasteryChart data={SUBJECT_MASTERY} />
                        </motion.div>
                    </div>

                    {/* Right Column (Tips & Recent) */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            <ImprovementTips tips={GLOBAL_TIPS} />
                        </motion.div>

                        {/* Recent Activity Mini-List */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6"
                        >
                            <h3 className="text-lg font-serif font-medium text-white mb-4">Activité Récente</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                        <div>
                                            <div className="text-sm font-medium text-white">Examen de Mathématiques</div>
                                            <div className="text-xs text-gray-500">Il y a {i + 1} jours</div>
                                        </div>
                                        <div className="text-sm font-bold text-green-400">16/20</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
