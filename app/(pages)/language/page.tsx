'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Globe2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LanguagePage() {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState('fr');

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'pt', name: 'Português', flag: '🇵🇹' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
    ];

    const handleLanguageSelect = (code: string) => {
        setSelectedLanguage(code);
        // TODO: Implement actual language change logic
        console.log('Language changed to:', code);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 lg:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-medium">Langue</h1>
                        <p className="text-gray-400 text-sm mt-1">Choisissez votre langue préférée</p>
                    </div>
                </header>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3"
                >
                    <Globe2 className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-purple-300 mb-1">Changement de langue</h3>
                        <p className="text-xs text-gray-400">
                            L'interface sera traduite dans la langue sélectionnée. Certains contenus générés par les utilisateurs peuvent rester dans leur langue d'origine.
                        </p>
                    </div>
                </motion.div>

                {/* Language List */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    {languages.map((language, index) => (
                        <motion.div
                            key={language.code}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <button
                                onClick={() => handleLanguageSelect(language.code)}
                                className={`w-full flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all duration-200 ${selectedLanguage === language.code ? 'bg-purple-500/10' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{language.flag}</span>
                                    <div className="text-left">
                                        <p className={`text-base font-medium ${selectedLanguage === language.code ? 'text-purple-300' : 'text-white'
                                            }`}>
                                            {language.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{language.code.toUpperCase()}</p>
                                    </div>
                                </div>
                                {selectedLanguage === language.code && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500"
                                    >
                                        <Check className="w-4 h-4 text-white" />
                                    </motion.div>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Save Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    onClick={() => router.push('/dashboard')}
                    className="w-full mt-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
                >
                    Enregistrer les modifications
                </motion.button>
            </div>
        </div>
    );
}
