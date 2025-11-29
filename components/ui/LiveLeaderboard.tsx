'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

interface Player {
    id: string;
    name: string;
    score: number;
    avatar: string;
    timeBonus?: number;
}

interface LiveLeaderboardProps {
    players: Player[];
    currentUserId: string;
    variant?: 'mini' | 'full';
}

export default function LiveLeaderboard({
    players,
    currentUserId,
    variant = 'mini'
}: LiveLeaderboardProps) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const displayedPlayers = variant === 'mini' ? sortedPlayers.slice(0, 3) : sortedPlayers;

    const getMedalIcon = (index: number) => {
        if (index === 0) return <span className="text-2xl">🥇</span>;
        if (index === 1) return <span className="text-2xl">🥈</span>;
        if (index === 2) return <span className="text-2xl">🥉</span>;
        return null;
    };

    const getMedalGradient = (index: number) => {
        if (index === 0) return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
        if (index === 1) return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
        if (index === 2) return 'from-orange-600/20 to-orange-700/20 border-orange-600/30';
        return '';
    };

    if (variant === 'mini') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-sm mx-auto"
            >
                <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-white" />
                    <h3 className="text-white font-serif font-medium">Classement</h3>
                </div>
                <div className="space-y-2">
                    {displayedPlayers.map((player, index) => (
                        <motion.div
                            key={player.id}
                            layout
                            className={`flex items-center justify-between p-3 rounded-xl ${player.id === currentUserId
                                    ? 'bg-white/20 border border-white/30'
                                    : 'bg-white/5 border border-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    {getMedalIcon(index)}
                                </div>
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    style={{ backgroundColor: player.avatar }}
                                >
                                    {player.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={`text-sm font-medium ${player.id === currentUserId ? 'text-white' : 'text-gray-300'
                                    }`}>
                                    {player.id === currentUserId ? 'Vous' : player.name}
                                </span>
                            </div>
                            <span className="text-white font-bold">{player.score}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    }

    // Full variant
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-serif font-medium text-white">Classement</h2>
            </div>

            <div className="space-y-3">
                {displayedPlayers.map((player, index) => (
                    <motion.div
                        key={player.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-5 rounded-2xl ${index < 3
                                ? `bg-gradient-to-br ${getMedalGradient(index)} border`
                                : 'bg-white/5 border border-white/10'
                            } ${player.id === currentUserId ? 'ring-2 ring-white/30' : ''
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {index < 3 ? (
                                    getMedalIcon(index)
                                ) : (
                                    <span className="text-xl font-bold text-gray-400">#{index + 1}</span>
                                )}
                            </div>
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: player.avatar }}
                            >
                                {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-medium text-lg">
                                    {player.id === currentUserId ? 'Vous' : player.name}
                                </p>
                                {player.timeBonus && player.timeBonus > 0 && (
                                    <p className="text-gray-400 text-sm">+{player.timeBonus} bonus temps</p>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-bold text-2xl">{player.score}</p>
                            <p className="text-gray-400 text-sm">points</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
