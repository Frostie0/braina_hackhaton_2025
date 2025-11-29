'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';

interface MultiplayerConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateRoom: (config: MultiplayerConfig) => void;
}

export interface MultiplayerConfig {
    questionsPerSession: number | 'all';
    maxPlayers: number;
    timePerQuestion: number;
}

export default function MultiplayerConfigModal({
    isOpen,
    onClose,
    onCreateRoom
}: MultiplayerConfigModalProps) {
    const [questionsPerSession, setQuestionsPerSession] = useState<number | 'all'>('all');
    const [maxPlayers, setMaxPlayers] = useState(5);
    const [timePerQuestion, setTimePerQuestion] = useState(15);

    const handleCreateRoom = () => {
        onCreateRoom({
            questionsPerSession,
            maxPlayers,
            timePerQuestion
        });
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                Comment aimeriez-vous jouer en groupe?
                            </h3>
                            <p className="text-gray-400 text-sm mt-2">
                                Vous pourrez ajuster ces préférences dans les paramètres.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800 ml-4"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6 mt-6">
                        {/* Questions per session */}
                        <div>
                            <h4 className="text-white font-medium mb-3">Questions par session</h4>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setQuestionsPerSession('all')}
                                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${questionsPerSession === 'all'
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setQuestionsPerSession(5)}
                                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${questionsPerSession === 5
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                >
                                    5
                                </button>
                            </div>
                        </div>

                        {/* Max players */}
                        <div>
                            <h4 className="text-white font-medium mb-3">Nombre max de joueurs</h4>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}
                                    className="p-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="text-2xl font-bold text-white w-16 text-center">
                                    {maxPlayers}
                                </span>
                                <button
                                    onClick={() => setMaxPlayers(Math.min(10, maxPlayers + 1))}
                                    className="p-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Time per question */}
                        <div>
                            <h4 className="text-white font-medium mb-3">Temps par question (secondes)</h4>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setTimePerQuestion(Math.max(5, timePerQuestion - 5))}
                                    className="p-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="text-2xl font-bold text-white w-16 text-center">
                                    {timePerQuestion}
                                </span>
                                <button
                                    onClick={() => setTimePerQuestion(Math.min(60, timePerQuestion + 5))}
                                    className="p-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Create Room Button */}
                    <button
                        onClick={handleCreateRoom}
                        className="w-full mt-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-lg shadow-purple-900/40"
                    >
                        Créer une partie
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
