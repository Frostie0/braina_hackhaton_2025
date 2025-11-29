'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Trophy, Award, ArrowLeft, RotateCcw } from 'lucide-react';
import LiveLeaderboard from '@/components/ui/LiveLeaderboard';

interface Player {
    id: string;
    name: string;
    score: number;
    avatar: string;
    timeBonus: number;
    correctAnswers?: number;
    totalQuestions?: number;
    averageTime?: number;
}

interface MultiplayerResultsScreenProps {
    roomCode: string;
    players: Player[];
    currentUserId: string;
}

export default function MultiplayerResultsScreen({
    roomCode,
    players,
    currentUserId
}: MultiplayerResultsScreenProps) {
    const router = useRouter();

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const currentPlayer = sortedPlayers.find(p => p.id === currentUserId);
    const myPosition = sortedPlayers.findIndex(p => p.id === currentUserId) + 1;

    const getPodiumHeight = (index: number) => {
        if (index === 0) return 'h-40'; // 1st
        if (index === 1) return 'h-32'; // 2nd
        if (index === 2) return 'h-24'; // 3rd
        return 'h-16';
    };

    return (
        <div className="min-h-screen bg-black flex flex-col p-4 overflow-y-auto">
            {/* Header */}
            <div className="max-w-5xl mx-auto w-full py-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex justify-center mb-4">
                        <Trophy className="w-16 h-16 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl font-serif font-medium text-white mb-2">
                        Classement Final
                    </h1>
                    <p className="text-gray-400">Partie terminée • {roomCode}</p>
                </motion.div>

                {/* Podium (Top 3) */}
                {sortedPlayers.length >= 3 && (
                    <div className="flex items-end justify-center gap-4 mb-12">
                        {/* 2nd Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3 border-4 border-gray-400/50"
                                style={{ backgroundColor: sortedPlayers[1].avatar }}
                            >
                                {sortedPlayers[1].name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center mb-2">
                                <p className="text-white font-medium">
                                    {sortedPlayers[1].id === currentUserId ? 'Vous' : sortedPlayers[1].name}
                                </p>
                                <p className="text-2xl font-bold text-white">{sortedPlayers[1].score}</p>
                                <p className="text-gray-400 text-sm">points</p>
                            </div>
                            <div className={`w-32 ${getPodiumHeight(1)} bg-gradient-to-br from-gray-400/20 to-gray-500/20 border border-gray-400/30 rounded-t-xl flex items-center justify-center`}>
                                <span className="text-5xl">🥈</span>
                            </div>
                        </motion.div>

                        {/* 1st Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, type: "spring", duration: 0.8 }}
                            className="flex flex-col items-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="mb-2"
                            >
                                <Trophy className="w-12 h-12 text-yellow-500" />
                            </motion.div>
                            <div
                                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-3 border-4 border-yellow-500/50 shadow-lg shadow-yellow-500/30"
                                style={{ backgroundColor: sortedPlayers[0].avatar }}
                            >
                                {sortedPlayers[0].name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center mb-2">
                                <p className="text-white font-bold text-lg">
                                    {sortedPlayers[0].id === currentUserId ? 'Vous' : sortedPlayers[0].name}
                                </p>
                                <p className="text-3xl font-bold text-yellow-500">{sortedPlayers[0].score}</p>
                                <p className="text-gray-400 text-sm">points</p>
                            </div>
                            <div className={`w-32 ${getPodiumHeight(0)} bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-t-xl flex items-center justify-center`}>
                                <span className="text-6xl">🥇</span>
                            </div>
                        </motion.div>

                        {/* 3rd Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, type: "spring", duration: 0.8 }}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3 border-4 border-orange-600/50"
                                style={{ backgroundColor: sortedPlayers[2].avatar }}
                            >
                                {sortedPlayers[2].name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-center mb-2">
                                <p className="text-white font-medium">
                                    {sortedPlayers[2].id === currentUserId ? 'Vous' : sortedPlayers[2].name}
                                </p>
                                <p className="text-2xl font-bold text-white">{sortedPlayers[2].score}</p>
                                <p className="text-gray-400 text-sm">points</p>
                            </div>
                            <div className={`w-32 ${getPodiumHeight(2)} bg-gradient-to-br from-orange-600/20 to-orange-700/20 border border-orange-600/30 rounded-t-xl flex items-center justify-center`}>
                                <span className="text-5xl">🥉</span>
                            </div>
                        </motion.div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Full Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <LiveLeaderboard
                            players={sortedPlayers}
                            currentUserId={currentUserId}
                            variant="full"
                        />
                    </motion.div>

                    {/* Personal Stats */}
                    {currentPlayer && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Award className="w-6 h-6 text-white" />
                                <h2 className="text-xl font-serif font-medium text-white">Vos statistiques</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400">Position finale</span>
                                    <span className="text-white font-bold text-2xl">#{myPosition}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400">Score total</span>
                                    <span className="text-white font-bold text-2xl">{currentPlayer.score}</span>
                                </div>
                                {currentPlayer.correctAnswers !== undefined && currentPlayer.totalQuestions !== undefined && (
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-gray-400">Précision</span>
                                        <span className="text-white font-bold text-2xl">
                                            {Math.round((currentPlayer.correctAnswers / currentPlayer.totalQuestions) * 100)}%
                                        </span>
                                    </div>
                                )}
                                {currentPlayer.averageTime && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Temps moyen</span>
                                        <span className="text-white font-bold text-2xl">{currentPlayer.averageTime.toFixed(1)}s</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8 max-w-2xl mx-auto"
                >
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 py-4 px-6 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Retour au Dashboard
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 py-4 px-6 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Rejouer
                    </button>
                </motion.div>
            </div>
        </div >
    );
}
