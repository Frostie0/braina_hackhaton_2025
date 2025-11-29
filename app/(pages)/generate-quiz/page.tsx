'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, ChevronRight, ChevronLeft } from 'lucide-react';

// Assurez-vous que les imports sont corrects
// Si vous utilisez un environnement de compilation comme Next.js, les chemins en '@/' sont corrects.
import { OptionSelector } from '@/components/ui/OptionSelector';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { FormError } from '@/components/ui/FormError';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { FilePreviewItem } from '@/components/ui/FilePreviewItem';
import { useQuizStore, Difficulty, Format, MaxQuestions } from '@/lib/store/quizStore';


// Options statiques pour les sélecteurs (inchangées)
const difficultyOptions = [
    { label: 'Facile', value: 'easy' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Difficile', value: 'hard' },
];

const formatOptions = [
    { label: 'Tout', value: 'all' },
    { label: 'Choix multiple', value: 'multiple_choice' },
    { label: 'Vrai ou Faux', value: 'true_false' },
    { label: 'Compléter', value: 'fill_in_blank' },
];

const maxQuestionsOptions = [
    { label: 'Auto', value: 'auto' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
    { label: '20', value: '20' },
];

/**
 * Page de génération de quiz accessible via /generate-quiz
 */
export default function GenerateQuizPage() {
    const {
        difficulty, setDifficulty,
        format, setFormat,
        maxQuestions, setMaxQuestions,
        language, files, addFile, removeFile,
        error, isLoading, validateAndGenerate
    } = useQuizStore();

    const [isLangSelectorOpen, setIsLangSelectorOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null); // Ref pour le défilement

    // Fonction de défilement du carrousel de fichiers
    const scrollSlider = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200; // Défilement de 200px
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            Array.from(event.target.files).forEach(file => {
                // Simuler l'ajout de fichier au store
                addFile(file as unknown as File);
            });
            // Réinitialiser le champ pour permettre la sélection du même fichier à nouveau
            event.target.value = '';
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        await validateAndGenerate();
    };

    return (
        // Utilise un fond gris foncé pour simuler l'affichage sur le Dashboard
        <div className="min-h-screen bg-gray-900 flex justify-center py-8">

            {/* Conteneur principal du formulaire - AUGMENTÉ POUR LE RESPONSIVE */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ type: 'tween', duration: 0.3 }}
                // max-w-4xl pour encore plus de largeur sur grand écran
                className="w-full max-w-lg lg:max-w-4xl bg-gray-900 lg:bg-gray-800 lg:rounded-2xl lg:shadow-xl flex flex-col h-full"
            >

                {/* En-tête (Titre et bouton Fermer) */}
                <header className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-white">Créer un Quiz</h1>
                    <motion.button
                        onClick={() => console.log('Close Modal')}
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

                    {/* Section Téléverser (FULL WIDTH) */}
                    <section className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">Téléverser</h2>
                            <span className="text-sm text-gray-500">{files.length}/8</span>
                        </div>

                        {/* Input Fichier Caché */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                            accept="image/*,.pdf,.txt" // Accepter plusieurs formats
                            className="hidden"
                        />

                        {/* Zone de Drag and Drop/Clic */}
                        <div
                            className="w-full h-32 border-2 border-dashed border-purple-500/50 bg-gray-800/50 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Plus className="w-6 h-6 text-purple-400 mb-1" />
                            <p className="text-purple-400 text-sm font-medium">Ajoutez un fichier (PDF, Image, Texte)</p>
                            <p className="text-gray-500 text-xs mt-1">Cliquez pour téléverser ou glisser-déposer</p>
                        </div>

                        {/* Carrousel des fichiers uploadés (Slides) */}
                        {files.length > 0 && (
                            <div className="relative mt-6">
                                {/* Bouton de défilement Gauche */}
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

                                {/* Bouton de défilement Droit */}
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

                    {/* Style pour cacher la scrollbar sur les éléments (besoin de CSS custom ou utilitaire) */}
                    <style jsx global>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none; /* IE and Edge */
                            scrollbar-width: none;  /* Firefox */
                        }
                    `}</style>


                    {/* Disposition des options en 2 colonnes sur grand écran */}
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <div className="lg:col-span-1">
                            {/* Sélecteur de Difficulté */}
                            <OptionSelector
                                title="Difficulté"
                                options={difficultyOptions}
                                selectedValue={difficulty}
                                onSelect={(v) => setDifficulty(v as Difficulty)}
                            />

                            {/* Sélecteur Max Questions (Déplacé pour équilibrer la colonne) */}
                            <OptionSelector
                                title="Max Questions"
                                options={maxQuestionsOptions}
                                selectedValue={maxQuestions}
                                onSelect={(v) => setMaxQuestions(v as MaxQuestions)}
                            />
                        </div>

                        <div className="lg:col-span-1">

                            {/* Sélecteur de Format */}
                            <OptionSelector
                                title="Format"
                                options={formatOptions}
                                selectedValue={format}
                                onSelect={(v) => setFormat(v as Format)}
                                layout="wrap"
                            />

                            {/* Sélecteur de Langue (Champ de style Liste) */}
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

                {/* Pied de page (Bouton Générer) */}
                <footer className="p-6 border-t border-gray-700 bg-gray-800 lg:rounded-b-2xl">
                    <SubmitButton
                        isLoading={isLoading}
                        loadingText="Génération en cours..."
                        className="w-full h-12 text-lg"
                    >
                        Générer le Quiz
                    </SubmitButton>
                </footer>

            </motion.div>

            {/* Modal du Sélecteur de Langue */}
            <LanguageSelector isOpen={isLangSelectorOpen} onClose={() => setIsLangSelectorOpen(false)} />
        </div>
    );
};