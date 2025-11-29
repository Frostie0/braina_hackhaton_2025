'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft, FileText, Send, AlertTriangle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Question {
    id: string;
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface QuizData {
    title: string;
    questions: Question[];
    subject?: string;
}

interface ExamScreenProps {
    quiz: QuizData;
    config?: any;
}

const EXAM_DURATION = 60 * 180; // 3 hours (180 minutes) as per model

export default function ExamScreen({ quiz, config }: ExamScreenProps) {
    const router = useRouter();

    // State
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const totalQuestions = quiz.questions.length;

    // Timer Logic
    useEffect(() => {
        if (isSubmitted) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    };

    const handleOptionSelect = (questionId: string, option: string) => {
        if (isSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setShowConfirmSubmit(false);
    };

    const calculateScore = () => {
        let correct = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) correct++;
        });
        return Math.round((correct / totalQuestions) * 20); // Score sur 20
    };

    const getGrade = (score: number) => {
        if (score >= 18) return { label: 'Excellent', color: 'text-green-600', stamp: 'border-green-600 text-green-600' };
        if (score >= 14) return { label: 'Très Bien', color: 'text-blue-600', stamp: 'border-blue-600 text-blue-600' };
        if (score >= 10) return { label: 'Passable', color: 'text-orange-600', stamp: 'border-orange-600 text-orange-600' };
        return { label: 'Insuffisant', color: 'text-red-600', stamp: 'border-red-600 text-red-600' };
    };

    // Render Results Screen
    if (isSubmitted) {
        const score = calculateScore();
        const grade = getGrade(score);

        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-sm shadow-2xl max-w-4xl w-full overflow-hidden relative"
                    style={{ minHeight: '600px' }}
                >
                    {/* Header Result */}
                    <div className="bg-gray-100 border-b border-gray-300 p-8 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Résultats de l'Examen</h1>
                            <p className="text-gray-600">Sujet : {quiz.title}</p>
                            <p className="text-gray-500 text-sm mt-1">Date : {new Date().toLocaleDateString()}</p>
                        </div>

                        {/* Stamp Grade */}
                        <motion.div
                            initial={{ scale: 2, opacity: 0, rotate: -20 }}
                            animate={{ scale: 1, opacity: 1, rotate: -15 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className={`border-4 rounded-xl p-4 font-black text-4xl uppercase tracking-widest opacity-80 transform rotate-[-15deg] ${grade.stamp}`}
                        >
                            {score}/20
                        </motion.div>
                    </div>

                    {/* Content Result */}
                    <div className="p-8 overflow-y-auto max-h-[60vh]">
                        <div className="space-y-6">
                            {quiz.questions.map((q, idx) => {
                                const userAnswer = answers[q.id];
                                const isCorrect = userAnswer === q.correctAnswer;

                                return (
                                    <div key={q.id} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="font-bold text-gray-500">Q{idx + 1}.</span>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 mb-2">{q.question}</p>
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 w-24">Votre réponse:</span>
                                                        <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                                            {userAnswer || 'Aucune réponse'}
                                                        </span>
                                                    </div>
                                                    {!isCorrect && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-500 w-24">Correction:</span>
                                                            <span className="font-medium text-green-700">{q.correctAnswer}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-xs text-gray-500 italic border-t border-gray-200 pt-2">
                                                    {q.explanation}
                                                </p>
                                            </div>
                                            {isCorrect ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <XCircle className="text-red-500 w-6 h-6" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Result */}
                    <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Retour au Tableau de bord
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Render Exam Interface
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 font-serif text-gray-900">

            {/* Top Bar (Floating) */}
            <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 shadow-md px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-medium text-sm hidden sm:block">Mode Examen</span>
                </div>

                <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeRemaining < 300 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    <Clock className="w-5 h-5" />
                    {formatTime(timeRemaining)}
                </div>

                <button
                    onClick={() => setShowConfirmSubmit(true)}
                    className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                >
                    <span>Rendre</span>
                    <Send className="w-4 h-4" />
                </button>
            </div>

            {/* Paper Container */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-[210mm] bg-white shadow-2xl mt-16 mb-12 min-h-[297mm] relative text-black"
                style={{
                    padding: '20mm',
                    fontFamily: '"Times New Roman", Times, serif'
                }}
            >
                {/* Official Header */}
                <div className="border-b-2 border-black pb-4 mb-6 text-center">
                    <h1 className="font-bold text-base uppercase leading-tight mb-1">
                        MINISTÈRE DE L'ÉDUCATION NATIONALE ET DE LA FORMATION PROFESSIONNELLE (MENFP)
                    </h1>
                    <h2 className="font-bold text-sm uppercase mb-1">
                        FILIERE D'ENSEIGNEMENT GÉNÉRAL
                    </h2>
                    <h2 className="font-bold text-sm uppercase mb-2">
                        EXAMENS DE FIN D'ÉTUDES SECONDAIRES
                    </h2>
                    <h1 className="font-bold text-xl uppercase mb-2">
                        {quiz.subject || quiz.title}
                    </h1>
                    <div className="font-bold text-sm uppercase mb-2">
                        SÉRIES : (SMP-SVT)
                    </div>
                    <div className="font-bold text-sm uppercase">
                        TEXTE MODÈLE
                    </div>
                </div>

                {/* Consignes */}
                <div className="mb-6 text-sm leading-relaxed">
                    <p className="font-bold italic mb-1">Consignes :</p>
                    <ol className="list-decimal list-inside space-y-0.5 italic text-black font-medium">
                        <li>L'usage de la calculatrice programmable est formellement interdit.</li>
                        <li>Tout gadget électronique (Tél., tablette, iPad, montre intelligente) est formellement interdit dans la salle d'examen.</li>
                        <li>Le silence est obligatoire dans la salle, il crée de meilleures conditions de travail.</li>
                        <li>Les deux parties de l'épreuve sont obligatoires.</li>
                    </ol>
                    <div className="text-right font-bold mt-4">
                        Durée de l'épreuve : 3 heures
                    </div>
                </div>

                <div className="w-full h-0.5 bg-black mb-8"></div>

                {/* Exam Content - Two Columns Layout for larger screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">

                    {/* Left Column - Part 1 */}
                    <div>
                        <h3 className="font-bold underline mb-1 uppercase text-sm">
                            A-PREMIÈRE PARTIE : {quiz.subject?.includes('Histoire') ? 'Histoire Nationale' : 'Connaissances Générales'} (60%)
                        </h3>
                        <p className="text-sm font-bold mb-4">
                            les candidats répondent aux questions des deux textes
                        </p>

                        {/* Textes historiques placeholder if subject is history */}
                        {quiz.subject?.includes('Histoire') && (
                            <div className="mb-4">
                                <h4 className="font-bold text-sm mb-2">Textes historiques</h4>
                                <div className="text-xs text-justify mb-4">
                                    <p className="font-bold mb-1">Texte 1</p>
                                    <p className="italic">
                                        (Texte généré dynamiquement ou espace réservé pour le texte source...)
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {quiz.questions.slice(0, Math.ceil(totalQuestions / 2)).map((q, idx) => (
                                <div key={q.id} className="break-inside-avoid">
                                    <div className="flex gap-2 mb-2">
                                        <span className="font-bold">{idx + 1}-</span>
                                        <p className="text-justify text-sm leading-relaxed">
                                            {q.question}
                                        </p>
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        {q.options.map((option, optIdx) => (
                                            <label key={optIdx} className="flex items-start gap-2 cursor-pointer group">
                                                <div className={`mt-0.5 w-3 h-3 border border-black rounded-full flex items-center justify-center transition-colors ${answers[q.id] === option ? 'bg-black' : 'group-hover:bg-gray-200'}`}>
                                                    {answers[q.id] === option && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    className="hidden"
                                                    onChange={() => handleOptionSelect(q.id, option)}
                                                    checked={answers[q.id] === option}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Part 2 */}
                    <div>
                        <h3 className="font-bold underline mb-4 uppercase text-sm">
                            DEUXIEME PARTIE (40%)
                            <br />
                            {quiz.subject?.includes('Histoire') ? 'Histoire Universelle et Géographie Générale' : 'Analyse et Réflexion'}
                        </h3>

                        <div className="space-y-6">
                            {quiz.questions.slice(Math.ceil(totalQuestions / 2)).map((q, idx) => (
                                <div key={q.id} className="break-inside-avoid">
                                    <div className="flex gap-2 mb-2">
                                        <span className="font-bold">{Math.ceil(totalQuestions / 2) + idx + 1}-</span>
                                        <p className="text-justify text-sm leading-relaxed">
                                            {q.question}
                                        </p>
                                    </div>
                                    <div className="pl-6 space-y-1">
                                        {q.options.map((option, optIdx) => (
                                            <label key={optIdx} className="flex items-start gap-2 cursor-pointer group">
                                                <div className={`mt-0.5 w-3 h-3 border border-black rounded-full flex items-center justify-center transition-colors ${answers[q.id] === option ? 'bg-black' : 'group-hover:bg-gray-200'}`}>
                                                    {answers[q.id] === option && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    className="hidden"
                                                    onChange={() => handleOptionSelect(q.id, option)}
                                                    checked={answers[q.id] === option}
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmSubmit && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl font-sans"
                        >
                            <div className="flex items-center gap-3 text-amber-500 mb-4">
                                <AlertTriangle className="w-8 h-8" />
                                <h3 className="text-xl font-bold text-gray-800">Rendre la copie ?</h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Vous avez répondu à {Object.keys(answers).length} sur {totalQuestions} questions.
                                Une fois rendu, vous ne pourrez plus modifier vos réponses.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirmSubmit(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Relire
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-medium"
                                >
                                    Confirmer et Rendre
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
