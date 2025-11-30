'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useQuizStore } from '@/lib/store/quizStore';

interface LanguageSelectorProps {
    isOpen: boolean;
    onClose: () => void;
}

const availableLanguages = [
    'Créole haitien', 'Français', 'Anglais', 'Espagnol'
];

/**
 * Composant Modal pour sélectionner la langue du Quiz.
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isOpen, onClose }) => {
    const { language, setLanguage } = useQuizStore();
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredLanguages = availableLanguages.filter(lang =>
        lang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (lang: string) => {
        setLanguage(lang);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur la modale
                    >
                        {/* Header */}
                        <header className="flex justify-between items-center p-5 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">Sélectionner la Langue</h2>
                            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </header>

                        {/* Corps de recherche et liste */}
                        <div className="p-5">
                            {/* Champ de recherche */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une langue..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Liste des langues */}
                            <div className="h-64 overflow-y-auto space-y-1">
                                {filteredLanguages.map(lang => (
                                    <motion.div
                                        key={lang}
                                        onClick={() => handleSelect(lang)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${lang === language
                                            ? 'bg-purple-600 text-white font-semibold'
                                            : 'text-gray-200 hover:bg-gray-700'
                                            }`}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {lang}
                                    </motion.div>
                                ))}
                                {filteredLanguages.length === 0 && (
                                    <p className="text-center text-gray-500 py-10">Aucun résultat trouvé.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};