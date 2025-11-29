'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Clock, HelpCircle, Brain } from 'lucide-react';
import Link from 'next/link';

interface QuizCardProps {
    id: string;
    title: string;
    date: string;
    questions: number;
    masteryPercentage: number;
}

const QuizSlideCard: React.FC<QuizCardProps> = ({ id, title, date, questions, masteryPercentage }) => {
    const progressBarWidth = `${masteryPercentage}%`;

    // Animation simple pour le hover
    const cardHoverVariants: Variants = {
        hover: {
            // scale: 1.03,
            // boxShadow: "0 10px 15px rgba(168, 85, 247, 0.4)", // Ombre violette
            transition: { duration: 0.2 }
        },
    };

    return (
        <Link href={`/quiz/${id}`}>
            <motion.div
                className="flex flex-col bg-gray-800 rounded-xl p-5 w-72 lg:w-80 flex-shrink-0 cursor-pointer border border-gray-700 hover:border-purple-500 transition-all"
                variants={cardHoverVariants}
                whileHover="hover"
            >
                <div className="flex items-center justify-between mb-4">
                    {/* Icône Brain violette */}
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/50">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    {/* Indicateur de statut si besoin (ommis pour le moment) */}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 min-h-[50px]">
                    {title}
                </h3>

                <div className="flex items-center text-sm text-gray-400 space-x-3 mb-4">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center">
                        <HelpCircle className="w-4 h-4 mr-1" />
                        <span>{questions} Questions</span>
                    </div>
                </div>

                {/* Barre de Progression */}
                <div className="mt-auto">
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                        <motion.div
                            className="bg-purple-500 h-2.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: progressBarWidth }}
                            transition={{ duration: 1 }}
                            style={{ width: progressBarWidth }}
                        />
                    </div>
                    <p className="text-sm font-medium text-purple-400">
                        {masteryPercentage}% mastery
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

export default QuizSlideCard;