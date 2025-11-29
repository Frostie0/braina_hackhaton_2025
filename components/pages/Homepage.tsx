'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Menu, X, ArrowRight, Check, ChevronDown, Plus, Minus, Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';
import ApplicationLogo from '@/components/ui/ApplicationLogo';

// --- Composants UI ---

const SectionHeading = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <h2 className={`text-3xl md:text-4xl font-serif font-medium tracking-tight text-white mb-6 ${className}`}>
        {children}
    </h2>
);

const Button = ({ children, variant = 'primary', className = "", ...props }: any) => {
    const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200";
    const variants = {
        primary: "bg-white text-black hover:bg-gray-200",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700",
        outline: "bg-transparent text-white border border-gray-600 hover:border-white",
        ghost: "bg-transparent text-gray-300 hover:text-white"
    };
    return (
        <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
            {children}
        </button>
    );
};

// --- Sections ---

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <ApplicationLogo size={52} />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                    <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Se connecter
                    </Link>
                    <Link href="/register">
                        <Button variant="primary" className="py-2 px-4 text-sm">
                            Essayer Braina
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col space-y-4">
                            <a href="#features" className="text-lg text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Fonctionnalités</a>
                            <a href="#faq" className="text-lg text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>FAQ</a>
                            <a href="#" className="text-lg text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Tarifs</a>
                            <div className="pt-4 flex flex-col gap-3">
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="secondary" className="w-full justify-center">Se connecter</Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="primary" className="w-full justify-center">Essayer Braina</Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-medium text-white leading-[1.1] mb-8">
                        L'IA qui transforme <br />
                        <span className="text-gray-400">vos notes en succès.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                        Braina utilise la puissance des IA de pointe pour générer instantanément des quiz, des flashcards et des résumés à partir de vos cours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/register">
                            <Button variant="primary" className="w-full sm:w-auto h-12 px-8 text-lg">
                                Démarrer gratuitement
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg group">
                                Voir les fonctionnalités
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 shadow-2xl relative">
                        {/* Abstract UI Representation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3/4 h-3/4 border border-white/5 rounded-xl bg-white/5 backdrop-blur-sm p-6 flex flex-col gap-4">
                                <div className="h-4 w-1/3 bg-white/10 rounded-full animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/10 rounded-full" />
                                    <div className="h-2 w-5/6 bg-white/10 rounded-full" />
                                    <div className="h-2 w-4/6 bg-white/10 rounded-full" />
                                </div>
                                <div className="mt-auto flex gap-3">
                                    <div className="h-20 w-full bg-purple-500/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                                        <span className="text-purple-300 text-xs font-mono">Quiz Généré</span>
                                    </div>
                                    <div className="h-20 w-full bg-cyan-500/20 rounded-lg border border-cyan-500/30 flex items-center justify-center">
                                        <span className="text-cyan-300 text-xs font-mono">Flashcards</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const FeatureCard = ({ title, description, icon: Icon }: any) => (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6 text-white">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-serif text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const Features = () => {
    return (
        <section id="features" className="py-24 bg-black px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 md:w-2/3">
                    <SectionHeading>Tout ce dont vous avez besoin pour exceller.</SectionHeading>
                    <p className="text-xl text-gray-400">Une suite d'outils complète pour les étudiants et les enseignants.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        title="Génération Instantanée"
                        description="Transformez vos PDF et images en matériel d'étude interactif en quelques secondes grâce à notre IA avancée."
                        icon={ArrowRight}
                    />
                    <FeatureCard
                        title="Quiz Intelligents"
                        description="Des questions générées sur mesure pour tester vos connaissances et identifier vos lacunes rapidement."
                        icon={Check}
                    />
                    <FeatureCard
                        title="Mode Multijoueur"
                        description="Rendez l'apprentissage ludique en défiant vos amis ou vos élèves dans des sessions en temps réel."
                        icon={Github} // Placeholder icon
                    />
                </div>
            </div>
        </section>
    );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10">
            <button
                className="w-full py-6 flex items-center justify-between text-left hover:text-gray-200 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-white">{question}</span>
                {isOpen ? <Minus className="text-gray-400" /> : <Plus className="text-gray-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-400 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "Qu'est-ce que Braina exactement ?",
            answer: "Braina est une plateforme d'apprentissage assistée par IA qui convertit vos documents de cours (PDF, images, notes) en quiz interactifs, flashcards et résumés pour optimiser vos révisions."
        },
        {
            question: "Est-ce gratuit ?",
            answer: "Nous proposons une version gratuite généreuse pour commencer. Des plans premium sont disponibles pour les utilisateurs ayant des besoins plus intensifs."
        },
        {
            question: "Quels types de fichiers sont supportés ?",
            answer: "Actuellement, nous supportons les images (JPG, PNG) et travaillons activement sur le support PDF complet."
        },
        {
            question: "Comment fonctionne le mode multijoueur ?",
            answer: "Un utilisateur crée une salle et partage un code. Les autres participants rejoignent la salle pour répondre aux mêmes questions en temps réel."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-black px-6">
            <div className="max-w-3xl mx-auto">
                <SectionHeading className="text-center mb-12">Foire aux questions</SectionHeading>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-20">
                <div className="col-span-2 lg:col-span-2">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <ApplicationLogo size={52} />
                    </Link>
                    <p className="text-gray-400 max-w-xs mb-8">
                        L'intelligence artificielle au service de votre réussite académique.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-white mb-6">Produit</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Pour les Écoles</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Mises à jour</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium text-white mb-6">Ressources</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Guide d'utilisation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Communauté</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Aide</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium text-white mb-6">Légal</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">CGU</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">© 2025 Braina. Tous droits réservés.</p>
                <div className="flex gap-6 text-sm text-gray-500">
                    <span>Fait avec ❤️ pour les étudiants</span>
                </div>
            </div>
        </footer>
    );
};

const Homepage = () => {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;