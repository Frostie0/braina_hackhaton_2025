'use client';

import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '@/lib/colors';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
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
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 max-w-2xl mx-auto w-full z-10">
                <div className="flex items-center gap-4 flex-1">
                    <span className="font-medium text-sm text-gray-400">
                        {currentIndex + 1}/{quiz.flashcards.length}
                    </span>
                    <div className="h-1.5 flex-1 rounded-full overflow-hidden bg-white/10">
                        <motion.div
                            className="h-full rounded-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-4 text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
                <div className="w-full max-w-xl aspect-[3/4] relative perspective-1000 cursor-pointer" onClick={handleFlip}>
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-500"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front */}
                        <div
                            className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center backface-hidden border border-white/20 bg-white/5 backdrop-blur-sm"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <h2 className="text-3xl lg:text-4xl font-serif font-medium text-center text-white leading-tight">
                                {currentCard.term}
                            </h2>

                            <div className="absolute bottom-8 left-8">
                                <Lightbulb className="w-6 h-6 opacity-30 text-white" />
                            </div>
                        </div>

                        {/* Back */}
                        <div
                            className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center backface-hidden border border-white/20 bg-white/5 backdrop-blur-sm"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                            }}
                        >
                            <p className="text-lg lg:text-xl text-center font-medium mb-8 leading-relaxed text-gray-200">
                                {currentCard.definition}
                            </p>

                            {currentCard.memoryTip && (
                                <div className="mt-4 text-center px-6 py-4 rounded-xl bg-white/10 border border-white/10">
                                    <p className="text-sm font-medium mb-2 text-white">Aide mémoire:</p>
                                    <p className="text-sm text-gray-300">{currentCard.memoryTip}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Controls */}
                <div className="flex justify-between w-full max-w-xl mt-8 px-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`px-8 py-3 rounded-xl font-medium transition-all ${currentIndex === 0
                                ? 'opacity-0 cursor-default'
                                : 'opacity-100 bg-white/10 hover:bg-white/20 text-white border border-white/10'
                            }`}
                    >
                        Précédent
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === quiz.flashcards.length - 1}
                        className={`px-8 py-3 rounded-xl font-medium transition-all ${currentIndex === quiz.flashcards.length - 1
                                ? 'opacity-0 cursor-default'
                                : 'opacity-100 bg-white hover:bg-gray-200 text-black'
                            }`}
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
}
