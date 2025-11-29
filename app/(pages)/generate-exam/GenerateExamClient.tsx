'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { OptionSelector } from '@/components/ui/OptionSelector';
import { FormError } from '@/components/ui/FormError';
import { FilePreviewItem } from '@/components/ui/FilePreviewItem';
import { QuizGenerationModal } from '@/components/ui/QuizGenerationModal';
import { extractTextFromMultipleImages, filterValidImages } from '@/lib/services/gemini.service';
import { serverIp } from '@/lib/serverIp';
import { getUserId } from '@/lib/storage/userStorage';

// Options pour les sélecteurs
const difficultyOptions = [
    { label: 'Facile', value: 'easy' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Difficile', value: 'hard' },
];

// Options de matières (adaptées pour le mode examen)
const subjectOptions = [
    { label: 'Mathématiques', value: 'mathematics' },
    { label: 'Physique-Chimie', value: 'physics_chemistry' },
    { label: 'SVT (Biologie)', value: 'biology' },
    { label: 'Histoire-Géographie', value: 'history_geography' },
    { label: 'Français', value: 'french' },
    { label: 'Philosophie', value: 'philosophy' },
    { label: 'Anglais', value: 'english' },
    { label: 'Sciences Économiques', value: 'economics' },
    { label: 'Informatique', value: 'computer_science' },
    { label: 'Autre', value: 'other' },
];

type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Page de génération d'examen blanc (Client Component)
 */
export default function GenerateExamClient() {
    const router = useRouter();

    // États pour les paramètres de l'examen
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [subject, setSubject] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    // États pour la modal de progression
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'generating' | 'success' | 'error'>('idle');
    const [modalProgress, setModalProgress] = useState(0);
    const [modalError, setModalError] = useState<string>();

    // Fonction de défilement du carrousel
    const scrollSlider = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles(prev => [...prev, ...newFiles]);
            event.target.value = '';
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
    };

    // Vérifier si le formulaire est valide
    const isFormValid = (): boolean => {
        return files.length > 0 && subject !== '';
    };

    // Fonction principale de génération de l'examen
    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (files.length === 0) {
            setError("Veuillez téléverser au moins une image pour générer l'examen.");
            return;
        }

        if (!subject) {
            setError("Veuillez sélectionner une matière pour l'examen.");
            return;
        }

        // Récupérer l'userId
        const userId = getUserId();
        if (!userId) {
            setError("Utilisateur non connecté. Veuillez vous reconnecter.");
            return;
        }

        // Filtrer uniquement les images valides
        const validImages = filterValidImages(files);
        if (validImages.length === 0) {
            setError("Aucune image valide trouvée. Veuillez téléverser des fichiers image (JPEG, PNG, WebP, GIF).");
            return;
        }

        // Ouvrir la modal et démarrer le processus
        setIsModalOpen(true);
        setModalStatus('extracting');
        setModalProgress(0);

        try {
            // ÉTAPE 1: Extraction du texte des images (0-40%)
            const extractedTexts = await extractTextFromMultipleImages(
                validImages,
                (current, total) => {
                    const progress = (current / total) * 40;
                    setModalProgress(progress);
                }
            );

            if (extractedTexts.length === 0) {
                throw new Error("Aucun texte n'a pu être extrait des images.");
            }

            // ÉTAPE 2: Analyse (40-60%)
            setModalStatus('analyzing');
            setModalProgress(50);

            await new Promise(resolve => setTimeout(resolve, 1000));

            // ÉTAPE 3: Génération de l'examen (60-100%)
            setModalStatus('generating');
            setModalProgress(60);

            // Pour le mode examen : format mixte et 20 questions par défaut
            const examFormat = 'both';
            const examMaxQuestions = 20;

            // Préparer les données pour le backend
            const examData = {
                data: extractedTexts,
                difficulty,
                maxQuestions: examMaxQuestions,
                subject, // Matière au lieu de language
                format: examFormat,
                userId,
                isPublic: false,
                isExam: true, // Flag pour indiquer que c'est un examen
            };

            // Envoyer au backend
            const response = await axios.post(`${serverIp}/quiz/create`, examData);

            setModalProgress(100);

            if (response.status === 201) {
                // Succès !
                setModalStatus('success');

                // Attendre 2 secondes puis rediriger vers le dashboard
                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/dashboard');
                }, 2000);
            } else {
                throw new Error(response.data?.error || 'Erreur lors de la création de l\'examen');
            }

        } catch (err: any) {
            console.error('❌ Erreur de génération:', err);
            setModalStatus('error');
            setModalError(
                err.response?.data?.error ||
                err.message ||
                'Une erreur est survenue lors de la génération de l\'examen.'
            );
        }
    };

    // Fermer la modal et réinitialiser
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalStatus('idle');
        setModalProgress(0);
        setModalError(undefined);

        if (modalStatus === 'success') {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center py-8">
            {/* Conteneur principal du formulaire */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-full max-w-lg lg:max-w-4xl bg-gray-900 lg:bg-gray-800 lg:rounded-2xl lg:shadow-xl flex flex-col h-full"
            >
                {/* En-tête */}
                <header className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-white">Créer un Examen Blanc</h1>
                    <motion.button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 transition"
                        whileTap={{ scale: 0.9 }}
                        type="button"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </header>

                {/* Corps du Formulaire */}
                <form onSubmit={handleGenerate} className="flex-1 p-6 overflow-y-auto">
                    {/* Section d'erreur générale */}
                    <FormError error={error ?? undefined} className="mb-6" />

                    {/* Section Téléverser */}
                    <section className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">Téléverser des images</h2>
                            <span className="text-sm text-gray-500">{files.length}/8</span>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept="image/*"
                            className="hidden"
                        />

                        <div
                            className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 rounded-xl p-8 bg-gray-700/20 hover:bg-gray-700/30 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Plus className="w-6 h-6 text-purple-400 mb-1" />
                            <p className="text-purple-400 text-sm font-medium">Ajoutez des images</p>
                            <p className="text-gray-500 text-xs mt-1">Cliquez pour téléverser ou glisser-déposer</p>
                        </div>

                        {/* Carrousel des fichiers uploadés */}
                        {files.length > 0 && (
                            <div className="relative mt-6">
                                {/* Bouton gauche */}
                                <motion.button
                                    type="button"
                                    onClick={() => scrollSlider('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-700/90 rounded-full text-white hover:bg-gray-600 transition"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </motion.button>

                                <div
                                    ref={sliderRef}
                                    className="flex gap-4 overflow-x-auto scrollbar-hide px-10"
                                >
                                    {files.map((file, index) => (
                                        <FilePreviewItem
                                            key={`${file.name}-${index}`}
                                            file={file}
                                            onRemove={() => handleRemoveFile(file.name)}
                                        />
                                    ))}
                                </div>

                                {/* Bouton droit */}
                                <motion.button
                                    type="button"
                                    onClick={() => scrollSlider('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-700/90 rounded-full text-white hover:bg-gray-600 transition"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        )}
                    </section>

                    {/* Style scrollbar-hide */}
                    <style jsx global>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>

                    {/* Options de configuration */}
                    <div className="space-y-6">
                        {/* Difficulté */}
                        <OptionSelector
                            title="Difficulté"
                            options={difficultyOptions}
                            selectedValue={difficulty}
                            onSelect={(v) => setDifficulty(v as Difficulty)}
                        />

                        {/* Matière */}
                        <OptionSelector
                            title="Matière"
                            options={subjectOptions}
                            selectedValue={subject}
                            onSelect={(v) => setSubject(v)}
                        />
                    </div>
                </form>

                {/* Pied de page */}
                <footer className="p-6 border-t border-gray-700 bg-gray-800 lg:rounded-b-2xl">
                    <button
                        type="submit"
                        disabled={!isFormValid()}
                        onClick={handleGenerate}
                        className={`w-full h-12 text-lg rounded-xl font-semibold shadow-lg transition-all duration-200 ${!isFormValid()
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                            : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-orange-500/30'
                            }`}
                    >
                        Générer l'Examen Blanc
                    </button>
                    {!isFormValid() && (
                        <p className="text-xs text-gray-400 text-center mt-2">
                            Téléversez au moins une image et sélectionnez la matière
                        </p>
                    )}
                </footer>
            </motion.div>

            {/* Modal de Génération de l'Examen */}
            <QuizGenerationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                status={modalStatus}
                progress={modalProgress}
                error={modalError}
            />
        </div>
    );
}
