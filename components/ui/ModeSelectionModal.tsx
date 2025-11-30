'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Layers, Users } from 'lucide-react';

interface ModeOption {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
}

interface ModeSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectMode: (mode: string) => void;
}

export default function ModeSelectionModal({
    isOpen,
    onClose,
    onSelectMode
}: ModeSelectionModalProps) {
    const modes: ModeOption[] = [
        {
            id: 'quiz',
            title: 'Quiz',
            description: 'Testez vos connaissances',
            icon: <Brain className="w-6 h-6" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30 hover:border-purple-500/60'
        },
        {
            id: 'flashcards',
            title: 'Flashcards',
            description: 'Renforcez les concepts clés',
            icon: <Layers className="w-6 h-6" />,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/30 hover:border-cyan-500/60'
        },
        {
            id: 'multiplayer',
            title: 'Multijoueur',
            description: 'Défiez vos amis',
            icon: <Users className="w-6 h-6" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30 hover:border-green-500/60'
        }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Que voulez-vous faire?</h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {modes.map((mode) => (
                                        <motion.button
                                            key={mode.id}
                                            onClick={() => {
                                                onSelectMode(mode.id);
                                                onClose();
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full p-4 rounded-xl border-2 ${mode.borderColor} ${mode.bgColor} 
                                                transition-all duration-200 text-left group hover:bg-opacity-20`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`${mode.color} p-3 rounded-lg bg-white/5`}>
                                                    {mode.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-semibold text-white text-base mb-0.5`}>
                                                        {mode.title}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm">
                                                        {mode.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
