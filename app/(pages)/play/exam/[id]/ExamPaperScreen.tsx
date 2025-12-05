"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Printer, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import serverIp from "@/lib/serverIp";

interface Question {
    number: string;
    text: string;
    type: string;
    points: number;
    blanks?: string[];
}

interface Section {
    title: string;
    text?: string;
    questions: Question[];
}

interface ExamHeader {
    ministry: string;
    examName: string;
    duration: string;
    series?: string;
}

interface ExamData {
    examId: string;
    title: string;
    subject: string;
    header: ExamHeader;
    sections: Section[];
}

interface CorrectionResult {
    globalScore: number;
    maxScore: number;
    feedback: Record<string, {
        score: number;
        comment: string;
        correction: string;
        isCorrect: boolean;
    }>;
}

interface ExamPaperScreenProps {
    exam: ExamData;
}

export default function ExamPaperScreen({ exam }: ExamPaperScreenProps) {
    const router = useRouter();
    const paperRef = useRef<HTMLDivElement>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [correction, setCorrection] = useState<CorrectionResult | null>(null);

    const handlePrint = () => {
        window.print();
    };

    const handleAnswerChange = (qIdx: string, value: string) => {
        setAnswers(prev => ({ ...prev, [qIdx]: value }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const response = await axios.post(`${serverIp}/exam/correct`, {
                examId: exam.examId,
                answers
            });
            setCorrection(response.data);
        } catch (error) {
            console.error("Error correcting exam:", error);
            alert("Erreur lors de la correction. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 font-serif print:bg-white print:p-0">
            {/* Toolbar */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Retour</span>
                </button>
                <div className="flex gap-3">
                    {!correction && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-sans font-medium disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4" />
                            )}
                            <span>Corriger l&apos;examen</span>
                        </button>
                    )}
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-sans font-medium"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Imprimer / PDF</span>
                    </button>
                </div>
            </div>

            {/* Score Display */}
            {correction && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-[210mm] mx-auto mb-6 bg-green-900/20 border border-green-500/30 p-6 rounded-xl text-center print:hidden"
                >
                    <h2 className="text-2xl font-bold text-green-400 mb-2">Correction terminée</h2>
                    <div className="text-4xl font-bold text-white">
                        {correction.globalScore} <span className="text-xl text-gray-400">/ {correction.maxScore}</span>
                    </div>
                    <p className="text-gray-400 mt-2">Consultez les détails ci-dessous</p>
                </motion.div>
            )}

            {/* A4 Paper Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[210mm] mx-auto bg-white text-black p-[20mm] shadow-2xl min-h-[297mm] print:shadow-none print:min-h-0 relative"
                ref={paperRef}
            >
                {/* Header */}
                <header className="text-center border-b-2 border-black pb-6 mb-8">
                    <h1 className="text-sm font-bold uppercase tracking-wide mb-1">
                        RÉPUBLIQUE D&apos;HAÏTI
                    </h1>
                    <h2 className="text-sm font-bold uppercase mb-4">
                        {exam.header.ministry || "MINISTÈRE DE L'ÉDUCATION NATIONALE ET DE LA FORMATION PROFESSIONNELLE (MENFP)"}
                    </h2>

                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold uppercase tracking-wider">
                            {exam.header.examName || exam.subject}
                        </h3>
                        {exam.header.series && (
                            <p className="font-bold">SÉRIES : {exam.header.series}</p>
                        )}
                    </div>

                    <div className="mt-4 flex justify-between items-end text-sm font-bold border-t border-black pt-2">
                        <span>{exam.header.duration}</span>
                        <span>Coefficient : ___</span>
                    </div>
                </header>

                {/* Content */}
                <div className="space-y-8">
                    {exam.sections.map((section, sIdx) => (
                        <section key={sIdx} className="break-inside-avoid">
                            <h4 className="font-bold text-lg mb-4 uppercase border-b border-gray-300 pb-1 inline-block">
                                {section.title}
                            </h4>

                            {section.text && (
                                <div className="mb-6 text-justify leading-relaxed text-[15px] columns-1 md:columns-2 gap-8 border-l-4 border-gray-200 pl-4 italic">
                                    {section.text}
                                </div>
                            )}

                            <div className="space-y-6">
                                {section.questions.map((q, qIdx) => {
                                    const uniqueId = `${sIdx}-${qIdx}`;
                                    const feedback = correction?.feedback[uniqueId];

                                    return (
                                        <div key={qIdx} className="group">
                                            <div className="flex gap-2">
                                                <span className="font-bold min-w-[2rem]">{q.number}</span>
                                                <div className="flex-1">
                                                    <p className="mb-2 leading-relaxed font-medium">{q.text}</p>

                                                    {/* Interactive Inputs */}
                                                    <div className="relative">
                                                        {q.type === 'essay' ? (
                                                            <textarea
                                                                value={answers[uniqueId] || ''}
                                                                onChange={(e) => handleAnswerChange(uniqueId, e.target.value)}
                                                                placeholder="Écrivez votre réponse ici..."
                                                                className={`w-full min-h-[150px] p-3 border-2 rounded-lg bg-gray-50 focus:bg-white transition-colors resize-y font-serif text-sm leading-relaxed ${feedback
                                                                    ? feedback.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                                                                    : 'border-gray-200 focus:border-black outline-none'
                                                                    }`}
                                                                readOnly={!!correction}
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={answers[uniqueId] || ''}
                                                                onChange={(e) => handleAnswerChange(uniqueId, e.target.value)}
                                                                placeholder="Votre réponse..."
                                                                className={`w-full p-2 border-b-2 bg-transparent transition-colors font-serif ${feedback
                                                                    ? feedback.isCorrect ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                                                                    : 'border-gray-300 focus:border-black outline-none'
                                                                    }`}
                                                                readOnly={!!correction}
                                                            />
                                                        )}

                                                        {/* Feedback Display */}
                                                        {feedback && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                className={`mt-2 p-3 rounded-lg text-sm border ${feedback.isCorrect
                                                                    ? 'bg-green-100 border-green-200 text-green-800'
                                                                    : 'bg-red-50 border-red-200 text-red-800'
                                                                    }`}
                                                            >
                                                                <div className="flex justify-between font-bold mb-1">
                                                                    <span>{feedback.isCorrect ? 'Correct' : 'Incorrect'}</span>
                                                                    <span>{feedback.score} / {q.points} pts</span>
                                                                </div>
                                                                <p className="mb-2">{feedback.comment}</p>
                                                                {!feedback.isCorrect && (
                                                                    <div className="mt-2 pt-2 border-t border-red-200">
                                                                        <span className="font-bold">Correction suggérée :</span>
                                                                        <p className="italic mt-1">{feedback.correction}</p>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="font-bold text-sm ml-2 text-gray-500">({q.points} pts)</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-gray-300 text-center text-xs text-gray-500 print:fixed print:bottom-4 print:left-0 print:right-0">
                    <p>Examen généré et corrigé par Braina - Usage strictement pédagogique</p>
                </footer>
            </motion.div>
        </div>
    );
}
