'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { LogIn, Menu, Zap, BookOpen, Users, Camera, Lightbulb, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Composant de l'icône de l'IA (représentant les grandes IA comme Claude/ChatGPT)
const AIAvatar: React.FC<{ icon: React.ReactNode, name: string }> = ({ icon, name }) => (
    <div className="flex flex-col items-center p-4 bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-900/40 border border-gray-700/50 transform hover:scale-[1.03] transition duration-300">
        <div className="p-3 bg-white/10 rounded-full mb-3">
            {icon}
        </div>
        <span className="text-sm font-medium text-gray-300">{name}</span>
    </div>
);

// Composant pour l'animation du texte d'accroche
const AnimatedText = () => {
    const text = "L'IA qui transforme vos notes en succès académique.";
    const words = text.split(" ");

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 text-center"
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </motion.h1>
    );
};

// Composant principal de la page d'accueil
const Homepage = () => {
    // État pour la navigation mobile (simulée)
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Variantes pour l'animation de la section Hero
    const heroVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5 } },
    };

    return (
        <div className="min-h-screen bg-gray-900 font-sans antialiased text-white">

            {/* Barre de Navigation (Navbar) */}
            <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    {/* Logo/Nom de l'application */}
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center text-2xl font-bold text-purple-400">
                        <Zap className="w-6 h-6 mr-2" />
                        Braina
                    </motion.div>

                    {/* Liens de Navigation Desktop */}
                    <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
                        <a href="#features" className="hover:text-purple-400 transition">Fonctionnalités</a>
                        <a href="#" className="hover:text-purple-400 transition">Professeurs</a>
                        <a href="#" className="hover:text-purple-400 transition">Élèves</a>
                    </div>

                    {/* Bouton de Connexion */}
                    <Link href="/login">
                        <motion.button
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="hidden md:flex items-center px-4 py-2 bg-purple-600 rounded-full text-white font-semibold hover:bg-purple-700 transition duration-300 shadow-md shadow-purple-500/50"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            Se Connecter
                        </motion.button>
                    </Link>

                    {/* Menu Mobile */}
                    <button className="md:hidden p-2 text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </nav>

                {/* Menu Mobile Dropdown */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden px-4 pt-2 pb-4 border-t border-gray-800 space-y-3"
                    >
                        <a href="#features" className="block py-2 text-gray-300 hover:text-purple-400 transition">Fonctionnalités</a>
                        <a href="#" className="block py-2 text-gray-300 hover:text-purple-400 transition">Professeurs</a>
                        <a href="#" className="block py-2 text-gray-300 hover:text-purple-400 transition">Élèves</a>
                        <Link href="/login">
                            <button className="w-full flex items-center justify-center mt-2 px-4 py-2 bg-purple-600 rounded-full text-white font-semibold hover:bg-purple-700 transition duration-300">
                                <LogIn className="w-5 h-5 mr-2" />
                                Se Connecter
                            </button>
                        </Link>
                    </motion.div>
                )}
            </header>

            {/* Section Hero */}
            <motion.section
                className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden p-4 sm:p-8"
                variants={heroVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Effet de fond : Gradient et Cercles de lumière */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"></div>
                <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] top-10 left-10 animate-pulse-slow"></div>
                <div className="absolute w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] bottom-10 right-10 animate-pulse-slow delay-500"></div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    {/* Titre Animé */}
                    <AnimatedText />

                    {/* Sous-titre */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto text-center"
                    >
                        Braina utilise la puissance des IA de pointe pour transformer la manière dont vous apprenez et enseignez.
                    </motion.p>

                    {/* Section des Actions/CTA */}
                    <div className="flex justify-center space-x-4 mb-16">
                        <Link href="/register">
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.8, duration: 0.3 }}
                                className="flex items-center px-8 py-3 bg-purple-600 rounded-full text-lg font-semibold hover:bg-purple-700 transition shadow-xl shadow-purple-500/40"
                            >
                                <Zap className="w-5 h-5 mr-2" />
                                Démarrer Gratuitement
                            </motion.button>
                        </Link>
                        <motion.a
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.9, duration: 0.3 }}
                            href="#features"
                            className="flex items-center px-8 py-3 bg-gray-700/50 border border-gray-600 rounded-full text-lg font-semibold hover:bg-gray-600 transition"
                        >
                            Voir les Fonctionnalités
                        </motion.a>
                    </div>

                    {/* Cartes de Fonctionnalités (Professeurs & Élèves) */}
                    <div id="features" className="grid md:grid-cols-2 gap-8 mt-16">

                        {/* Carte Élèves */}
                        <motion.div
                            variants={cardVariants}
                            transition={{ delay: 2.0 }}
                            className="bg-gray-800/50 p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-xl"
                        >
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-purple-400 flex items-center">
                                <BookOpen className="w-6 h-6 mr-3" />
                                Pour les Élèves : L'étude instantanée
                            </h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start">
                                    <Camera className="w-5 h-5 mt-1 mr-3 flex-shrink-0 text-cyan-400" />
                                    <span>**Capturez vos notes :** Prenez une photo de n'importe quel document ou note manuscrite.</span>
                                </li>
                                <li className="flex items-start">
                                    <Lightbulb className="w-5 h-5 mt-1 mr-3 flex-shrink-0 text-cyan-400" />
                                    <span>**Génération Automatique :** Recevez instantanément des Quiz, des Flashcards et des Résumés.</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Carte Professeurs */}
                        <motion.div
                            variants={cardVariants}
                            transition={{ delay: 2.2 }}
                            className="bg-gray-800/50 p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-xl"
                        >
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-cyan-400 flex items-center">
                                <Users className="w-6 h-6 mr-3" />
                                Pour les Professeurs : Engagement Compétitif
                            </h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start">
                                    <Zap className="w-5 h-5 mt-1 mr-3 flex-shrink-0 text-purple-400" />
                                    <span>**Création Rapide de Quiz :** Créez des quiz basés sur vos supports en quelques clics.</span>
                                </li>
                                <li className="flex items-start">
                                    <TrendingUp className="w-5 h-5 mt-1 mr-3 flex-shrink-0 text-purple-400" />
                                    <span>**Mode Multijoueur :** Lancez des sessions en temps réel, compétitives et ludiques pour toute la classe.</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* L'image des IA (simulée par des icônes pour le style) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.5, duration: 0.5 }}
                        className="flex justify-center items-center mt-12 space-x-8"
                    >
                        <AIAvatar icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 20 12.1v2.1l-2 1.9c-.8.8-1.7 1.2-2.7 1.2h-3.4l-4 4v-4z" /></svg>} name="ChatGPT" />
                        <AIAvatar icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="M9.9 10.6a2 2 0 1 1 2.8-2.8l2.8-2.8a2 2 0 1 1 2.8 2.8l-2.8 2.8a2 2 0 1 1-2.8 2.8z" /><path d="M4 14l2 2m0 0l2-2m-2 2v4m4 0l2-2m0 0l2 2m-2-2v-4" /></svg>} name="Claude/Gemini" />
                    </motion.div>

                </div>
            </motion.section>

        </div>
    );
};

export default Homepage;