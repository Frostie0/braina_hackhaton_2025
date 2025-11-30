'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
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

// Options de niveau scolaire
const levelOptions = [
    { label: '9ème Année Fondamentale', value: '9eme_bac' },
    { label: 'Ns4 (Baccalauréat)', value: 'nsa_bac' },
    { label: 'Universitaire', value: 'universitaire' },
];

// Options de matières (adaptées pour le mode examen)
interface SubjectOption {
    label: string;
    value: string;
    levels: string[]; // IDs des niveaux autorisés
    available: boolean;
}

const subjectOptions: SubjectOption[] = [
    // { label: 'Mathématiques', value: 'mathematics', levels: ['9eme_bac', 'nsa_bac', 'universitaire'], available: false },
    // { label: 'Physique-Chimie', value: 'physics_chemistry', levels: ['9eme_bac', 'nsa_bac', 'universitaire'], available: true },
    { label: 'SVT (Biologie)', value: 'biology', levels: ['9eme_bac', 'nsa_bac', 'universitaire'], available: true },
    // { label: 'Histoire-Géographie', value: 'history_geography', levels: ['9eme_bac', 'nsa_bac'], available: false },
    // { label: 'Français', value: 'french', levels: ['9eme_bac', 'nsa_bac'], available: false },
    // { label: 'Philosophie', value: 'philosophy', levels: ['nsa_bac', 'universitaire'], available: false },
    // { label: 'Anglais', value: 'english', levels: ['9eme_bac', 'nsa_bac', 'universitaire'], available: false },
    // { label: 'Sciences Économiques', value: 'economics', levels: ['nsa_bac', 'universitaire'], available: false }, // Coming soon
    // { label: 'Informatique', value: 'computer_science', levels: ['nsa_bac', 'universitaire'], available: false }, // Coming soon
    { label: 'Espagnol', value: 'spanish', levels: ['9eme_bac'], available: true }, // Coming soon
    // { label: 'Autre', value: 'other', levels: ['9eme_bac', 'nsa_bac', 'universitaire'], available: false },
];

type Difficulty = 'easy' | 'medium' | 'hard';
type Level = '9eme_bac' | 'nsa_bac' | 'universitaire';

/**
 * Page de génération d'examen blanc (Client Component)
 */
export default function GenerateExamClient() {
    const router = useRouter();

    // États pour les paramètres de l'examen
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [level, setLevel] = useState<Level>('9eme_bac'); // Par défaut BACC
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

        if (!level) {
            setError("Veuillez sélectionner un niveau scolaire pour l'examen.");
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
                level, // Niveau scolaire
                maxQuestions: examMaxQuestions,
                subject, // Matière au lieu de language
                format: examFormat,
                userId,
                isPublic: false,
                isExam: true, // Flag pour indiquer que c'est un examen
            };

            // Simuler une progression progressive pendant l'appel API (60-95%)
            const progressInterval = setInterval(() => {
                setModalProgress(prev => {
                    if (prev < 95) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 200); // Incrémente de 1% toutes les 200ms

            try {
                // Envoyer au backend (Nouvelle route Exam)
                const response = await axios.post(`${serverIp}/exam/create`, examData);

                clearInterval(progressInterval);
                console.log('Exam creation response:', response.data);
                setModalProgress(100);

                if (response.status === 201) {
                    // Succès !
                    setModalStatus('success');

                    // Récupérer l'ID de l'examen créé
                    const examId = response.data?.exam?.examId || response.data?.examId;
                    console.log('Extracted examId:', examId);

                    // Attendre 2 secondes puis rediriger vers l'examen
                    setTimeout(() => {
                        setIsModalOpen(false);
                        if (examId) {
                            // Rediriger vers l'écran d'examen (Paper UI)
                            console.log('Redirecting to:', `/play/exam/${examId}`);
                            router.push(`/play/exam/${examId}`);
                        } else {
                            // Fallback vers le dashboard si pas d'ID
                            console.error('No examId found in response');
                            router.push('/dashboard');
                        }
                    }, 2000);
                } else {
                    throw new Error(response.data?.error || 'Erreur lors de la création de l\'examen');
                }
            } catch (apiErr: any) {
                clearInterval(progressInterval);
                throw apiErr; // Re-throw pour le catch externe
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
        <div className="min-h-screen bg-black flex justify-center py-8 px-4">
            {/* Conteneur principal du formulaire */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-4xl flex flex-col"
            >
                {/* En-tête */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 group"
                            type="button"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm">Retour</span>
                        </button>
                        <h1 className="text-3xl font-serif font-medium text-white">Créer un Examen Blanc</h1>
                        <p className="text-gray-400 mt-2">Préparez-vous avec un examen personnalisé</p>
                    </div>
                </header>

                {/* Corps du Formulaire */}
                <form onSubmit={handleGenerate} className="flex-1 space-y-8">
                    {/* Section d'erreur générale */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Section Téléverser */}
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h2 className="text-lg font-serif font-medium text-white">Documents sources</h2>
                                <p className="text-sm text-gray-400 mt-1">Téléversez vos supports de cours</p>
                            </div>
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
                            className="w-full h-40 border-2 border-dashed border-white/20 bg-white/5 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-white text-sm font-medium">Cliquez ou glissez-déposez vos images</p>
                            <p className="text-gray-500 text-xs mt-1">PNG, JPG, WebP jusqu'à 10MB</p>
                        </div>

                        {/* Carrousel des fichiers uploadés */}
                        {files.length > 0 && (
                            <div className="relative mt-6 group/slider">
                                {/* Bouton gauche */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => scrollSlider('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-0"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </motion.button>

                                {/* Liste des fichiers */}
                                <div
                                    ref={sliderRef}
                                    className="flex gap-4 overflow-x-auto py-3 px-2 scrollbar-hide snap-x"
                                    style={{ scrollBehavior: 'smooth' }}
                                >
                                    {files.map((file, index) => (
                                        <div key={`${file.name}-${index}`} className="snap-center shrink-0">
                                            <FilePreviewItem
                                                file={file}
                                                onRemove={() => handleRemoveFile(file.name)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Bouton droite */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => scrollSlider('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity"
                                >
                                    <ChevronRight className="w-4 h-4" />
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

                    {/* Configuration de l'examen */}
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-serif font-medium text-white mb-5">Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <OptionSelector
                                title="Difficulté"
                                options={difficultyOptions}
                                selectedValue={difficulty}
                                onSelect={(v) => setDifficulty(v as Difficulty)}
                            />

                            <OptionSelector
                                title="Niveau Scolaire"
                                options={levelOptions}
                                selectedValue={level}
                                onSelect={(v) => setLevel(v as Level)}
                            />

                            <div className="md:col-span-2">
                                <OptionSelector
                                    title="Matière"
                                    options={subjectOptions}
                                    selectedValue={subject}
                                    onSelect={(v) => setSubject(v)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Bouton de génération */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={!isFormValid()}
                            onClick={handleGenerate}
                            className="w-full py-4 px-6 bg-purple-500 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500 transition-all"
                        >
                            {!isFormValid() ? 'Complétez le formulaire' : 'Générer l\'examen blanc'}
                        </button>
                        {!isFormValid() && (
                            <p className="text-xs text-gray-500 text-center mt-3">
                                Téléversez au moins une image, sélectionnez le niveau et la matière
                            </p>
                        )}
                    </div>
                </form>
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
