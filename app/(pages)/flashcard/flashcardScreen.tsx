'use client';

import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '@/lib/colors';

interface FlashcardData {
    term: string;
    definition: string;
    hint?: string;
    memoryTip?: string;
}

interface QuizData {
    flashcards: FlashcardData[];
}

export default function FlashcardScreen({ quiz }: { quiz: QuizData }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = quiz.flashcards[currentIndex];
    const progress = ((currentIndex + 1) / quiz.flashcards.length) * 100;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex < quiz.flashcards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(currentIndex + 1), 200);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(currentIndex - 1), 200);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col relative overflow-hidden"
            style={{ backgroundColor: colors.white, color: colors.black }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 max-w-md mx-auto w-full z-10">
                <div className="flex items-center gap-4 flex-1">
                    <span className="font-medium text-lg" style={{ color: colors.grayText }}>
                        {currentIndex + 1}/{quiz.flashcards.length}
                    </span>
                    <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: colors.gray2 }}>
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: colors.secondary }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
                <button
                    className="p-2 rounded-full transition-colors ml-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                    <X className="w-6 h-6" style={{ color: colors.grayText }} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
                <div className="w-full aspect-[3/4] relative perspective-1000 cursor-pointer" onClick={handleFlip}>
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-500"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front */}
                        <div
                            className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center backface-hidden shadow-2xl border"
                            style={{
                                backgroundColor: colors.gray2,
                                borderColor: `${colors.secondary}33`,
                                backfaceVisibility: 'hidden'
                            }}
                        >
                            <h2 className="text-3xl font-bold text-center" style={{ color: colors.grayText }}>
                                {currentCard.term}
                            </h2>

                            <div className="absolute bottom-8 left-8">
                                <Lightbulb className="w-6 h-6 opacity-50" style={{ color: colors.grayText }} />
                            </div>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center backface-hidden shadow-2xl border"
                            style={{
                                backgroundColor: colors.gray2,
                                borderColor: `${colors.secondary}33`,
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                            }}
                        >
                            <p className="text-xl text-center font-medium mb-8 leading-relaxed" style={{ color: colors.grayText }}>
                                {currentCard.definition}
                            </p>

                            {currentCard.memoryTip && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-semibold mb-1" style={{ color: colors.secondary }}>Aide mémoire:</p>
                                    <p className="text-base" style={{ color: colors.grayText }}>{currentCard.memoryTip}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-between w-full mt-8 px-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${currentIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'
                            }`}
                        style={{ backgroundColor: `${colors.gray}40`, color: colors.grayText }}
                    >
                        Précédent
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === quiz.flashcards.length - 1}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${currentIndex === quiz.flashcards.length - 1 ? 'opacity-0 cursor-default' : 'opacity-100'
                            }`}
                        style={{ backgroundColor: colors.primary, color: colors.secondary }}
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}
