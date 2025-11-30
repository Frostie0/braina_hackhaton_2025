'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, ChevronRight, Filter, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { serverIp } from '@/lib/serverIp';

interface Exam {
  examId: string;
  title: string;
  subject: string;
  level: string;
  createdAt: string;
}

interface ExamsListProps {
  exams: Exam[];
  onDelete?: (examId: string) => void;
}

export default function ExamsList({ exams, onDelete }: ExamsListProps) {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, examId: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) return;

    try {
      setDeletingId(examId);
      await axios.delete(`${serverIp}/exam/${examId}`);
      if (onDelete) onDelete(examId);
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getLevelBadge = (level: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      '9eme_bac': { label: '9ème AF', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
      'nsa_bac': { label: 'NS4', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
      'universitaire': { label: 'Universitaire', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    };
    return badges[level] || { label: level, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  };

  const filteredExams = filterLevel === 'all'
    ? exams
    : exams.filter(exam => exam.level === filterLevel);

  if (exams.length === 0) {
    return null;
  }

  const levels = [
    { value: 'all', label: 'Tous' },
    { value: '9eme_bac', label: '9ème AF' },
    { value: 'nsa_bac', label: 'NS4' },
    { value: 'universitaire', label: 'Universitaire' },
  ];

  return (
    <div>
      {/* Filtres */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => setFilterLevel(level.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filterLevel === level.value
              ? 'bg-white text-black'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
          >
            {level.label}
          </button>
        ))}
        {filteredExams.length > 0 && (
          <span className="text-xs text-gray-500 ml-2">
            {filteredExams.length} examen{filteredExams.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Liste horizontale */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1">
          <AnimatePresence mode='popLayout'>
            {filteredExams.map((exam, index) => {
              const badge = getLevelBadge(exam.level);
              return (
                <Link key={exam.examId} href={`/play/exam/${exam.examId}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative w-[280px] flex-shrink-0 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(e, exam.examId)}
                      disabled={deletingId === exam.examId}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all z-10"
                    >
                      {deletingId === exam.examId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                        {exam.subject}
                      </h3>

                      <p className="text-sm text-gray-400 line-clamp-2">
                        {exam.title}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-white/5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Créé le {formatDate(exam.createdAt)}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-end mt-3">
                      <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Gradient fade sur les côtés */}
        <div className="absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      </div>

      {/* Message si aucun résultat */}
      {filteredExams.length === 0 && (
        <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
          Aucun examen pour ce filtre
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
