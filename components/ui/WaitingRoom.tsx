'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Share2, MoreVertical } from 'lucide-react';

interface Player {
    id: string;
    name: string;
    avatar: string;
    isHost: boolean;
}

interface WaitingRoomProps {
    roomCode: string;
    currentPlayers: Player[];
    maxPlayers: number;
    onClose: () => void;
    onStartGame: () => void;
    isHost: boolean;
}

export default function WaitingRoom({
    roomCode,
    currentPlayers,
    maxPlayers,
    onClose,
    onStartGame,
    isHost
}: WaitingRoomProps) {
    const [showCopied, setShowCopied] = useState(false);

    const handleShare = async () => {
        try {
            const shareUrl = `${window.location.origin}/join/${roomCode}`;
            await navigator.clipboard.writeText(shareUrl);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h1 className="text-2xl font-serif font-medium text-white">Salle d'attente</h1>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
                {/* Room Code Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm mb-2">Code de la partie</p>
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-wider font-mono">
                            {roomCode}
                        </h2>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={handleShare}
                                className="px-6 py-2.5 bg-white hover:bg-gray-200 text-black font-medium rounded-xl transition flex items-center gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                {showCopied ? 'Copié !' : 'Partager'}
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Players List */}
                <div className="mb-6">
                    <h3 className="text-white font-serif font-medium mb-4 text-lg">
                        Joueurs ({currentPlayers.length}/{maxPlayers})
                    </h3>
                    <div className="space-y-3">
                        {currentPlayers.map((player) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                        style={{ backgroundColor: player.avatar }}
                                    >
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{player.name}</p>
                                    </div>
                                </div>
                                {player.isHost && (
                                    <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-lg border border-white/20">
                                        Hôte
                                    </span>
                                )}
                            </motion.div>
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: maxPlayers - currentPlayers.length }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 border-dashed rounded-xl opacity-40"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/10" />
                                <p className="text-gray-500">En attente...</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            {isHost && (
                <div className="p-6 border-t border-white/10 bg-black/95 backdrop-blur-sm">
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={onStartGame}
                            disabled={currentPlayers.length < 2}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition ${currentPlayers.length >= 2
                                    ? 'bg-white hover:bg-gray-200 text-black'
                                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Commencer la partie
                        </button>
                        {currentPlayers.length < 2 && (
                            <p className="text-center text-gray-400 text-sm mt-2">
                                Attendez au moins 2 joueurs pour commencer
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
