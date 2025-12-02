'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Plus, Minus, Github, Twitter, Linkedin, Instagram, Upload, Sparkles, Trophy, Brain, FileText, Zap, Users, Target, BookOpen, Star, Check } from 'lucide-react';
import Link from 'next/link';
import ApplicationLogo from '@/components/ui/ApplicationLogo';
import { useAuth } from '@/lib/context/AuthContext';

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

const getInitials = (name: string) => {
    if (!name) return 'G';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, loading } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <ApplicationLogo size={52} />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                    <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
                    <a href="#how-it-works" className="hover:text-white transition-colors">Comment ça marche</a>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated && user ? (
                        <Link href="/dashboard" className="flex items-center group">
                            <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center mr-3 shadow-lg shadow-purple-900/20">
                                <span className="text-xs font-bold text-white">
                                    {loading ? '...' : getInitials(user.name)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 hidden lg:block">
                                <p className="text-sm font-medium text-white truncate group-hover:text-purple-200 transition-colors">
                                    {loading ? 'Chargement...' : user.name}
                                </p>
                            </div>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Se connecter
                            </Link>
                            <Link href="/register">
                                <Button variant="primary" className="py-2 px-4 text-sm">
                                    Commencer gratuitement
                                </Button>
                            </Link>
                        </>
                    )}
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
                            <a href="#how-it-works" className="text-lg text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>Comment ça marche</a>
                            <a href="#faq" className="text-lg text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>FAQ</a>
                            <div className="pt-4 flex flex-col gap-3">
                                {isAuthenticated && user ? (
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                                                <span className="text-xs font-bold text-white">
                                                    {loading ? '...' : getInitials(user.name)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{user.name}</p>
                                                <p className="text-sm text-gray-400">Accéder au tableau de bord</p>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="secondary" className="w-full justify-center">Se connecter</Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="primary" className="w-full justify-center">Commencer gratuitement</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const HeroCarousel = () => {
    const images = [
        "/assets/img/create_quiz.png",
        "/assets/img/quiz.png",
        "/assets/img/result_quiz.png",
        "/assets/img/winning_quiz.png"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-6" : "bg-white/40 hover:bg-white/60"}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const TypingText = () => {
    const titles = [
        "Réussissez vos examens",
        "Maîtrisez vos cours",
        "Défiez vos amis",
        "Excellez en étude"
    ];

    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentTitle = titles[currentTitleIndex];

        if (!isDeleting && displayedText === currentTitle) {
            const timeout = setTimeout(() => setIsDeleting(true), 2000);
            return () => clearTimeout(timeout);
        }

        if (isDeleting && displayedText === "") {
            setIsDeleting(false);
            setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
            return;
        }

        const timeout = setTimeout(() => {
            if (isDeleting) {
                setDisplayedText(currentTitle.substring(0, displayedText.length - 1));
            } else {
                setDisplayedText(currentTitle.substring(0, displayedText.length + 1));
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentTitleIndex]);

    return (
        <>
            {displayedText}
            <span className="animate-pulse text-purple-500">|</span>
        </>
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
                        <TypingText /> <br />
                        <span className="text-purple-500">avec Braina.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                        Transformez vos notes de cours en <span className="text-purple-300 font-semibold">quiz interactifs</span>, <span className="text-purple-300 font-semibold">flashcards</span> et <span className="text-purple-300 font-semibold">examens blancs</span> en quelques secondes grâce à l'IA. Apprenez plus vite, retenez plus longtemps.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Link href="/register">
                            <Button variant="primary" className="w-full sm:w-auto h-12 px-8 text-lg group">
                                Commencer gratuitement
                                <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg group">
                                Voir comment ça marche
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>Gratuit pour commencer</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span>IA de pointe</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 shadow-2xl relative">
                        <HeroCarousel />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const Stats = () => {
    const stats = [
        { value: "10K+", label: "Quiz générés", icon: Brain },
        { value: "5K+", label: "Étudiants actifs", icon: Users },
        { value: "95%", label: "Taux de réussite", icon: Target },
        { value: "24/7", label: "Disponible", icon: Zap }
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-black to-black/50 px-6 border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="flex justify-center mb-3">
                                <stat.icon className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const steps = [
        {
            icon: Upload,
            title: "Importez vos supports",
            description: "Téléversez vos notes, PDFs ou images de cours. Braina accepte tous types de documents : cours magistraux, livres, slides...",
            color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            gradient: "from-blue-500/20 to-transparent"
        },
        {
            icon: Sparkles,
            title: "L'IA travaille pour vous",
            description: "Notre intelligence artificielle analyse votre contenu et génère automatiquement des quiz, flashcards et examens blancs personnalisés selon votre niveau.",
            color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            gradient: "from-purple-500/20 to-transparent"
        },
        {
            icon: Trophy,
            title: "Apprenez en vous amusant",
            description: "Révisez efficacement seul ou défiez vos amis en multijoueur. Participez à des tournois inter-classes et suivez vos progrès en temps réel.",
            color: "bg-green-500/10 text-green-400 border-green-500/20",
            gradient: "from-green-500/20 to-transparent"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-black/50 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <SectionHeading>Comment fonctionne Braina</SectionHeading>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Transformez vos cours en outils de révision puissants en 3 étapes simples
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative group"
                        >
                            <div className={`h-full p-8 rounded-2xl bg-white/5 border ${step.color} hover:bg-white/10 transition-all duration-300 relative overflow-hidden`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                <div className="relative z-10">
                                    <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon size={32} />
                                    </div>
                                    <h3 className="text-2xl font-serif font-medium text-white mb-4">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent transform -translate-y-1/2 z-10">
                                    <ArrowRight className="absolute -right-2 -top-2 w-6 h-6 text-purple-500/50" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ title, description, icon: Icon, benefits }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300"
    >
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
            <Icon size={28} />
        </div>
        <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-purple-400 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed mb-4">{description}</p>
        {benefits && (
            <ul className="space-y-2">
                {benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-500">
                        <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>
        )}
    </motion.div>
);

const Features = () => {
    return (
        <section id="features" className="py-24 bg-black px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center md:text-left md:w-2/3"
                >
                    <SectionHeading>Tout ce dont vous avez besoin pour réussir</SectionHeading>
                    <p className="text-xl text-gray-400">Une suite d'outils IA complète pour transformer votre façon d'apprendre</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        title="Examens Blancs IA"
                        description="Simulez les conditions réelles d'examen avec des sujets générés par l'IA à partir de vos cours."
                        icon={FileText}
                        benefits={[
                            "Génération automatique basée sur vos cours",
                            "Difficulté adaptative selon votre niveau",
                            "Correction instantanée et détaillée"
                        ]}
                    />
                    <FeatureCard
                        title="Quiz & Flashcards Intelligents"
                        description="Mémorisez efficacement avec des outils de révision adaptatifs qui s'ajustent à vos progrès."
                        icon={Brain}
                        benefits={[
                            "Quiz générés automatiquement",
                            "Système de répétition espacée",
                            "Suivi de progression en temps réel"
                        ]}
                    />
                    <FeatureCard
                        title="Mode Compétition"
                        description="Rendez l'apprentissage addictif avec des défis multijoueurs et des tournois entre classes."
                        icon={Trophy}
                        benefits={[
                            "Défis en temps réel avec vos amis",
                            "Classements et récompenses",
                            "Tournois inter-écoles (bientôt)"
                        ]}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <FeatureCard
                        title="Étude Personnalisée"
                        description="Notre IA identifie vos points faibles et crée des parcours d'apprentissage sur mesure."
                        icon={Target}
                        benefits={[
                            "Analyse de vos lacunes",
                            "Recommandations personnalisées",
                            "Plans d'étude optimisés"
                        ]}
                    />
                    <FeatureCard
                        title="Bibliothèque de Ressources"
                        description="Accédez à une bibliothèque grandissante de contenus partagés par la communauté."
                        icon={BookOpen}
                        benefits={[
                            "Milliers de quiz publics",
                            "Partage avec vos camarades",
                            "Import/export facile"
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const testimonials = [
        {
            name: "Marie L.",
            role: "Étudiante en Médecine",
            content: "Braina m'a permis de réduire mon temps de révision de 50% tout en améliorant mes notes. Les examens blancs sont d'une qualité incroyable !",
            rating: 5,
            avatar: "M"
        },
        {
            name: "Jean-Pierre D.",
            role: "Étudiant en Droit",
            content: "Le mode multijoueur rend l'apprentissage tellement plus fun ! Je révise avec mes amis et on progresse ensemble.",
            rating: 5,
            avatar: "JP"
        },
        {
            name: "Sophie M.",
            role: "Lycéenne - Terminale S",
            content: "Grâce à Braina, j'ai obtenu mon bac avec une moyenne de 17/20. Les quiz adaptatifs m'ont aidée à combler mes lacunes.",
            rating: 5,
            avatar: "S"
        }
    ];

    return (
        <section className="py-24 bg-black/50 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <SectionHeading>Ils ont transformé leur façon d'apprendre</SectionHeading>
                    <p className="text-xl text-gray-400">Rejoignez des milliers d'étudiants qui réussissent avec Braina</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{testimonial.name}</div>
                                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
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
                className="w-full py-6 flex items-center justify-between text-left hover:text-purple-500 transition-colors group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-white pr-8">{question}</span>
                <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                    {isOpen ? <Minus className="text-purple-400" /> : <Plus className="text-purple-500" />}
                </div>
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
            question: "Comment fonctionne la génération de quiz par l'IA ?",
            answer: "Braina utilise des modèles d'IA de pointe (GPT-4, Claude) pour analyser vos documents de cours et générer automatiquement des questions pertinentes. L'IA identifi les concepts clés, crée des questions de différents niveaux de difficulté et génère des distracteurs intelligents pour les QCM."
        },
        {
            question: "Quels types de fichiers puis-je importer ?",
            answer: "Vous pouvez importer des images (JPG, PNG, WebP), des PDFs de cours, et bientôt des documents Word. Notre OCR reconnaît le texte dans les images scannées, et l'IA peut comprendre aussi bien du texte que des schémas."
        },
        {
            question: "Est-ce vraiment gratuit ?",
            answer: "Oui ! Braina propose un plan gratuit généreux avec 50 quiz par mois et toutes les fonctionnalités de base. Les plans premium débloquent un nombre illimité de générations, des fonctionnalités avancées et la priorité sur les serveurs."
        },
        {
            question: "Puis-je utiliser Braina pour préparer un concours ou examen officiel ?",
            answer: "Absolument ! Braina est parfait pour préparer le bac, les concours (médecine, écoles d'ingénieurs), les examens universitaires, et même des certifications professionnelles. Les examens blancs génèrent des conditions réalistes d'examen."
        },
        {
            question: "Comment fonctionne le mode multijoueur ?",
            answer: "Créez une salle, partagez le code avec vos amis, et participez à des quiz en temps réel ! Le mode multijoueur inclut des classements en direct, des power-ups, et bientôt des tournois inter-classes avec des récompenses."
        },
        {
            question: "Mes données sont-elles sécurisées ?",
            answer: "Oui, nous prenons la sécurité très au sérieux. Tous vos documents sont chiffrés, stockés de manière sécurisée, et ne sont jamais partagés avec des tiers. Vous pouvez supprimer vos données à tout moment."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-black px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeading className="text-center mb-12">Foire aux questions</SectionHeading>
                </motion.div>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <FAQItem question={faq.question} answer={faq.answer} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTA = () => {
    return (
        <section className="py-24 px-6 bg-gradient-to-b from-black/50 to-black">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl" />
                    <div className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-3xl p-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                            Prêt à transformer votre façon d'apprendre ?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Rejoignez des milliers d'étudiants qui utilisent Braina pour réussir leurs examens. Commencez gratuitement, aucune carte bancaire requise.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button variant="primary" className="h-14 px-10 text-lg group">
                                    Commencer gratuitement
                                    <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/demo-exam-screen">
                                <Button variant="outline" className="h-14 px-10 text-lg">
                                    Voir une démo
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 mt-6">
                            ✓ Gratuit pour toujours • ✓ Aucune carte bancaire • ✓ Configuration en 2 minutes
                        </p>
                    </div>
                </motion.div>
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
                        L'intelligence artificielle au service de votre réussite académique. Apprenez plus vite, retenez plus longtemps.
                    </p>
                    <div className="flex gap-4 text-purple-500">
                        <a href="#" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="GitHub"><Github size={20} /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        <a href="#" className="hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-white mb-6">Produit</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                        <li><a href="/demo-exam-screen" className="hover:text-white transition-colors">Démo</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Nous contacter</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium text-white mb-6">Ressources</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Guide d'utilisation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Communauté</a></li>
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
                <Stats />
                <HowItWorks />
                <Features />
                <Testimonials />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;