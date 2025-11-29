'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { OptionSelector } from '@/components/ui/OptionSelector';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { FormError } from '@/components/ui/FormError';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FilePreviewItem } from '@/components/ui/FilePreviewItem';
import { QuizGenerationModal } from '@/components/ui/QuizGenerationModal';
import { useQuizStore, Difficulty, Format, MaxQuestions } from '@/lib/store/quizStore';
import { extractTextFromMultipleImages, filterValidImages } from '@/lib/services/gemini.service';
import { serverIp } from '@/lib/serverIp';
import { getUserId } from '@/lib/storage/userStorage';

// Options pour les sélecteurs
const difficultyOptions = [
    { label: 'Facile', value: 'easy' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Difficile', value: 'hard' },
];

const formatOptions = [
    { label: 'Mixte', value: 'both' },
    { label: 'Choix multiple', value: 'multiple_choice' },
    { label: 'Vrai ou Faux', value: 'true_false' },
];

const maxQuestionsOptions = [
    { label: 'Auto', value: 'auto' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
    { label: '20', value: '20' },
];

/**
 * Page de génération de quiz (Client Component)
 */
export default function GenerateQuizClient() {
    const router = useRouter();
    const {
        difficulty, setDifficulty,
        format, setFormat,
        maxQuestions, setMaxQuestions,
        language, files, addFile, removeFile,
    } = useQuizStore();

    const [isLangSelectorOpen, setIsLangSelectorOpen] = useState(false);
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
            Array.from(event.target.files).forEach(file => {
                addFile(file as unknown as File);
            });
            event.target.value = '';
        }
    };

    // Vérifier si le formulaire est valide
    const isFormValid = (): boolean => {
        return files.length > 0 && language !== 'Sélectionner une langue';
    };

    // Fonction principale de génération du quiz
    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (files.length === 0) {
            setError("Veuillez téléverser au moins une image pour générer le quiz.");
            return;
        }

        if (language === 'Sélectionner une langue' || !language) {
            setError("Veuillez sélectionner une langue pour le quiz.");
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

            await new Promise(resolve => setTimeout(resolve, 1000)); // Petite pause pour l'UX

            // ÉTAPE 3: Génération du quiz (60-100%)
            setModalStatus('generating');
            setModalProgress(60);

            // Convertir maxQuestions en nombre
            const maxQuestionsNumber = maxQuestions === 'auto' ? 10 : parseInt(maxQuestions);

            // Préparer les données pour le backend
            const quizData = {
                data: extractedTexts,
                difficulty,
                maxQuestions: maxQuestionsNumber,
                language,
                format: format === 'all' ? 'both' : format,
                userId,
                isPublic: false, // Par défaut, quiz privé
            };

            // Envoyer au backend
            const response = await axios.post(`${serverIp}/quiz/create`, quizData);

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
                throw new Error(response.data?.error || 'Erreur lors de la création du quiz');
            }

        } catch (err: any) {
            console.error('❌ Erreur de génération:', err);
            setModalStatus('error');
            setModalError(
                err.response?.data?.error ||
                err.message ||
                'Une erreur est survenue lors de la génération du quiz.'
            );
        }
    };

    // Fermer la modal et réinitialiser
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalStatus('idle');
        setModalProgress(0);
        setModalError(undefined);

        // Si c'est une erreur, ne pas rediriger
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
                transition={{ type: 'tween', duration: 0.3 }}
                className="w-full max-w-lg lg:max-w-4xl bg-gray-900 lg:bg-gray-800 lg:rounded-2xl lg:shadow-xl flex flex-col h-full"
            >
                {/* En-tête */}
                <header className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-white">Créer un Quiz</h1>
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

                        {/* Input Fichier Caché */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept="image/*"
                            className="hidden"
                        />

                        {/* Zone de Drag and Drop/Clic */}
                        <div
                            className="w-full h-32 border-2 border-dashed border-purple-500/50 bg-gray-800/50 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
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
                                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-900/80 rounded-full shadow-lg text-white hover:bg-gray-700 transition hidden lg:flex items-center justify-center border border-gray-700"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </motion.button>

                                {/* Conteneur défilant */}
                                <div
                                    ref={sliderRef}
                                    className="flex overflow-x-auto space-x-4 pb-4 pt-2 px-2 scrollbar-hide"
                                    style={{ WebkitOverflowScrolling: 'touch' }}
                                >
                                    {files.map((file, index) => (
                                        <FilePreviewItem
                                            key={`${file.name}-${index}`}
                                            file={file}
                                            onRemove={removeFile}
                                        />
                                    ))}
                                </div>

                                {/* Bouton droit */}
                                <motion.button
                                    type="button"
                                    onClick={() => scrollSlider('right')}
                                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-900/80 rounded-full shadow-lg text-white hover:bg-gray-700 transition hidden lg:flex items-center justify-center border border-gray-700"
                                    whileTap={{ scale: 0.9 }}
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

                    {/* Disposition des options en 2 colonnes */}
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <div className="lg:col-span-1">
                            {/* Difficulté */}
                            <OptionSelector
                                title="Difficulté"
                                options={difficultyOptions}
                                selectedValue={difficulty}
                                onSelect={(v) => setDifficulty(v as Difficulty)}
                            />

                            {/* Max Questions */}
                            <OptionSelector
                                title="Max Questions"
                                options={maxQuestionsOptions}
                                selectedValue={maxQuestions}
                                onSelect={(v) => setMaxQuestions(v as MaxQuestions)}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            {/* Format */}
                            <OptionSelector
                                title="Format"
                                options={formatOptions}
                                selectedValue={format}
                                onSelect={(v) => setFormat(v as Format)}
                                layout="wrap"
                            />

                            {/* Langue */}
                            <section className="mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Langue</h3>
                                <motion.div
                                    onClick={() => setIsLangSelectorOpen(true)}
                                    className="flex justify-between items-center p-4 bg-gray-800 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <p className="text-white">{language}</p>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </motion.div>
                            </section>
                        </div>
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
                                : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-purple-500/30'
                            }`}
                    >
                        Générer le Quiz
                    </button>
                    {!isFormValid() && (
                        <p className="text-xs text-gray-400 text-center mt-2">
                            Téléversez au moins une image et sélectionnez la langue
                        </p>
                    )}
                </footer>
            </motion.div>

            {/* Modal du Sélecteur de Langue */}
            <LanguageSelector isOpen={isLangSelectorOpen} onClose={() => setIsLangSelectorOpen(false)} />

            {/* Modal de Génération du Quiz */}
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
