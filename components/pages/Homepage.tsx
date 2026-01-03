'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles, Trophy, Brain, FileText, Zap, Users, Target, BookOpen, Star, Check, Sun, Moon, Play, ChevronRight, Quote, Upload, Twitter, Github, Linkedin, Instagram, Apple, Smartphone, Info, GraduationCap, Presentation, Building2, Heart } from 'lucide-react';
// import AppleIcon from '@mui/icons-material/Apple';
import Link from 'next/link';
import ApplicationLogo from '@/components/ui/ApplicationLogo';
import { useAuth } from '@/lib/context/AuthContext';
import { useTheme } from '@/lib/context/ThemeContext';

// --- Composants UI ---

const SectionHeading = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const { theme } = useTheme();
    return (
        <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-6 ${className}`} style={{ color: theme.text }}>
            {children}
        </h2>
    );
};

const Button = ({ children, variant = 'primary', className = "", ...props }: any) => {
    const { theme } = useTheme();

    const baseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg";

    const variants = {
        primary: `text-white hover:shadow-purple-500/50`,
        secondary: `bg-gray-800 text-white hover:bg-gray-700 border border-gray-700`,
        outline: `bg-transparent border-2 hover:bg-opacity-10`,
        ghost: `bg-transparent hover:bg-opacity-10 shadow-none`
    };

    const style = variant === 'primary'
        ? { backgroundColor: theme.accent, ...props.style }
        : variant === 'outline'
            ? { borderColor: theme.text, color: theme.text, ...props.style }
            : { color: theme.text, ...props.style };

    return (
        <button
            className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
            style={style}
            {...props}
        >
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
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const { user, isAuthenticated, loading } = useAuth();
    const { theme, mode } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Detect active section based on scroll position
            const sections = ['features', 'how-it-works', 'faq'];
            const scrollPosition = window.scrollY;

            // If at top of page, no section is active
            if (scrollPosition < 100) {
                setActiveSection('');
                return;
            }

            // Find the current active section
            // We want the section that is currently most visible in the viewport
            let currentSection = '';
            let closestDistance = Infinity;

            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + scrollPosition;

                    // Calculate distance from the top of viewport (accounting for navbar height)
                    const distance = Math.abs(elementTop - scrollPosition - 100);

                    // If this section is in view and closer than previous closest
                    if (rect.top <= 150 && rect.bottom >= 0 && distance < closestDistance) {
                        closestDistance = distance;
                        currentSection = `#${sectionId}`;
                    }
                }
            });

            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        handleScroll(); // Initial check
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-xl shadow-xl' : 'backdrop-blur-md'}`}
            style={{
                backgroundColor: scrolled ? (mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)') : 'rgba(0, 0, 0, 0.3)',
                borderBottom: scrolled ? `1px solid ${theme.gray2}60` : `1px solid rgba(255, 255, 255, 0.1)`
            }}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <ApplicationLogo size={48} withText={false} className="hidden sm:block transition-transform group-hover:scale-110 duration-300" />
                    <span className="text-xl font-bold transition-colors group-hover:text-purple-400 duration-300" style={{ color: theme.text }}>Braina</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-1 bg-opacity-50 p-1.5 rounded-full px-4 border" style={{
                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }}>
                    {[
                        { name: 'Fonctionnalités', href: '#features' },
                        { name: 'Comment ça marche', href: '#how-it-works' },
                        { name: 'FAQ', href: '#faq' }
                    ].map((item) => {
                        const isActive = activeSection === item.href;
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    isActive
                                        ? 'text-white shadow-lg'
                                        : 'hover:bg-purple-500/10 hover:text-purple-400'
                                }`}
                                style={{
                                    color: isActive ? 'white' : theme.textSecondary,
                                    backgroundColor: isActive ? theme.accent : 'transparent'
                                }}
                            >
                                {item.name}
                            </a>
                        );
                    })}
                </div>

                {/* Auth Buttons / User Profile */}
                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated && user ? (
                        <Link href="/dashboard">
                            <div className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border-2 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:border-purple-500/50 group"
                                style={{
                                    backgroundColor: theme.cardBg,
                                    borderColor: theme.gray2
                                }}>
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-purple-500/20 transform group-hover:scale-110 group-hover:ring-purple-500/40 transition-all duration-300"
                                    style={{ backgroundColor: theme.accent }}>
                                    <span className="text-xs">
                                        {loading ? '...' : getInitials(user.name)}
                                    </span>
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-sm font-bold truncate max-w-[100px] group-hover:text-purple-400 transition-colors" style={{ color: theme.text }}>
                                        {loading ? 'Chargement...' : user.name}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-bold hover:text-purple-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/5" style={{ color: theme.text }}>
                                Se connecter
                            </Link>
                            <Link href="/register">
                                <Button variant="primary" className="py-2.5 px-6 text-sm shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95">
                                    S'inscrire
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20 active:scale-95"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ color: theme.text }}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b overflow-hidden shadow-xl"
                        style={{ backgroundColor: theme.background, borderColor: theme.gray2 }}
                    >
                        <div className="px-6 py-8 flex flex-col space-y-3">
                            {[
                                { name: 'Fonctionnalités', href: '#features' },
                                { name: 'Comment ça marche', href: '#how-it-works' },
                                { name: 'FAQ', href: '#faq' }
                            ].map((item) => {
                                const isActive = activeSection === item.href;
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={`relative text-lg font-semibold flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                                            isActive ? 'shadow-lg' : 'hover:bg-white/5'
                                        }`}
                                        style={{
                                            color: isActive ? 'white' : theme.text,
                                            backgroundColor: isActive ? theme.accent : 'transparent'
                                        }}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{item.name}</span>
                                        <ChevronRight size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                                    </a>
                                );
                            })}

                            <div className="h-px w-full bg-gray-200/10" />

                            <div className="pt-2 flex flex-col gap-4">
                                {isAuthenticated && user ? (
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <div className="flex items-center gap-4 p-4 rounded-2xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.gray2 }}>
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{ backgroundColor: theme.accent }}>
                                                <span className="text-sm">
                                                    {loading ? '...' : getInitials(user.name)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg" style={{ color: theme.text }}>{user.name}</p>
                                                <p className="text-sm" style={{ color: theme.textSecondary }}>Accéder au tableau de bord</p>
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-center border" style={{ borderColor: theme.gray2 }}>Se connecter</Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                            <Button variant="primary" className="w-full justify-center shadow-lg shadow-purple-500/20">Commencer gratuitement</Button>
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
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4" style={{ borderColor: theme.cardBg }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 w-full h-full object-contain bg-black/20"
                />
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"}`}
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
        // "Étudiez plus intelligemment",
        // "Révisez en défiant vos amis",
    ];

    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const { theme } = useTheme();

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
        <span className="inline-block w-full min-h-[120px] sm:min-h-[90px] md:min-h-[80px] leading-tight align-top">
            {displayedText}
            <span className="animate-pulse ml-1" style={{ color: theme.accent }}>|</span>
        </span>
    );
};

const Hero = () => {
    const { theme, mode } = useTheme();
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-screen flex items-center">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20" style={{ backgroundColor: theme.accent }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: theme.blue }} />
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border" style={{ backgroundColor: 'rgba(234, 179, 8, 0.3)', borderColor: 'rgba(234, 179, 8, 0.3)' }}>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-yellow-400"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                        <span className="text-sm font-bold text-yellow-500">3ème gagnant du Hackathon Ayiti.ai 2025</span>
                    </div>
                    {/* <TypingText /> */}
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight" style={{ color: theme.text }}>
                        Réussissez vos examens<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">avec Braina.</span>
                    </h1>

                    <p className="text-xl mb-10 max-w-lg leading-relaxed font-medium" style={{ color: theme.textSecondary }}>
                        Transformez vos notes de cours en <span style={{ color: theme.accent }}>quiz interactifs</span>, flashcards et examens blancs en quelques secondes grâce à l'IA.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <Link href="/register">
                            <Button variant="primary" className="w-full sm:w-auto h-14 px-8 text-lg group shadow-xl shadow-purple-500/20">
                                Commencer gratuitement
                                <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg group">
                                <Play className="mr-2 w-4 h-4 fill-current" />
                                Démo vidéo
                            </Button>
                        </Link>
                    </div>

                    {/* <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <div className="group relative">
                            <button className="flex items-center gap-3 px-6 py-3 rounded-xl border transition-all hover:bg-gray-100/5" style={{ backgroundColor: theme.cardBg, borderColor: theme.gray2 }}>
                                <Apple size={24} className="text-white" />
                                <div className="text-left">
                                    <p className="text-[10px] font-medium uppercase opacity-60" style={{ color: theme.text }}>Télécharger sur</p>
                                    <p className="text-sm font-bold" style={{ color: theme.text }}>App Store</p>
                                </div>
                            </button>
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Bientôt disponible
                            </div>
                        </div>

                        <div className="group relative">
                            <button className="flex items-center gap-3 px-6 py-3 rounded-xl border transition-all hover:bg-gray-100/5" style={{ backgroundColor: theme.cardBg, borderColor: theme.gray2 }}>
                                <Smartphone size={24} className="text-white" />
                                <div className="text-left">
                                    <p className="text-[10px] font-medium uppercase opacity-60" style={{ color: theme.text }}>DISPONIBLE SUR</p>
                                    <p className="text-sm font-bold" style={{ color: theme.text }}>Google Play</p>
                                </div>
                            </button>
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Bientôt disponible
                            </div>
                        </div>
                    </div> */}

                    <div className="flex items-center gap-8 pt-8 border-t" style={{ borderColor: theme.gray2 }}>
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }} />
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white bg-black">
                                +200
                            </div>
                        </div>

                        <div>
                            <div className="flex gap-1 mb-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Aimé par 1,000+ étudiants</p>
                        </div >

                    </div>
                </motion.div >

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                    className="relative hidden lg:block"
                >
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2rem] blur-lg opacity-30 animate-pulse" />
                    <div className="relative rounded-[2rem] p-2 bg-gradient-to-br from-gray-800 to-black shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 h-[600px]">
                        <HeroCarousel />

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -left-12 top-20 p-4 rounded-xl shadow-xl backdrop-blur-md border border-white/10 flex items-center gap-3 max-w-[200px]"
                            style={{ backgroundColor: mode === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)' }}
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Check size={20} strokeWidth={3} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Réponse correcte</p>
                                <p className="text-sm font-bold text-green-600">+150 pts</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="absolute -right-8 bottom-20 p-4 rounded-xl shadow-xl backdrop-blur-md border border-white/10 flex items-center gap-3"
                            style={{ backgroundColor: mode === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)' }}
                        >
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Brain size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Quiz généré</p>
                                <p className="text-sm font-bold" style={{ color: theme.text }}>Introduction à l'IA</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div >
        </section >
    );
};

const TrustedBy = () => {
    const { theme } = useTheme();
    const universities = [
        "Université d'État d'Haïti",
        "Université Quisqueya",
        "ESINF",
        "Université Notre Dame",
        "ISTEAH"
    ];

    return (
        <section className="py-10 border-y" style={{ backgroundColor: theme.background, borderColor: theme.gray2 }}>
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm font-bold uppercase tracking-widest mb-8 opacity-60" style={{ color: theme.textSecondary }}>
                    Recommandé par les étudiants de
                </p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {universities.map((uni, index) => (
                        <span key={index} className="text-xl md:text-1xl font-medium font-serif" style={{ color: theme.text }}>
                            {uni}
                        </span>
                    ))}
                </div>
            </div >
        </section >
    );
};

const Stats = () => {
    const { theme } = useTheme();
    const stats = [
        { value: "1K+", label: "Quiz générés", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10" },
        { value: "200+", label: "Étudiants actifs", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { value: "95%", label: "Taux de réussite", icon: Target, color: "text-green-500", bg: "bg-green-500/10" },
        { value: "24/7", label: "Disponible", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" }
    ];

    return (
        <section className="py-10 px-6 border-y relative overflow-hidden" style={{ backgroundColor: theme.background, borderColor: theme.gray2 }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center text-center group cursor-default"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                <stat.icon size={32} />
                            </div>
                            <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight" style={{ color: theme.text }}>{stat.value}</div>
                            <div className="text-sm font-medium uppercase tracking-wider" style={{ color: theme.textSecondary }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const { theme } = useTheme();
    const steps = [
        {
            icon: Upload,
            title: "Importez vos supports",
            description: "Téléversez vos notes, PDFs ou images de cours. Braina accepte tous types de documents.",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            icon: Sparkles,
            title: "L'IA travaille pour vous",
            description: "Notre IA analyse votre contenu et génère automatiquement des quiz et flashcards personnalisés.",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            icon: Trophy,
            title: "Apprenez en jouant",
            description: "Révisez efficacement seul ou défiez vos amis en multijoueur pour grimper dans le classement.",
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "border-green-500/20"
        }
    ];

    return (
        <section id="how-it-works" className="py-32 px-6 relative" style={{ backgroundColor: theme.background }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* <span className="text-sm font-bold tracking-wider uppercase mb-3 block" style={{ color: theme.accent }}>Processus simple</span> */}
                        <SectionHeading>Comment fonctionne Braina</SectionHeading>
                        <p className="text-xl max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
                            Transformez vos cours en outils de révision puissants en 3 étapes simples
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className={`w-24 h-24 rounded-3xl ${step.bg} ${step.border} border-2 flex items-center justify-center mb-8 relative z-10 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 duration-300`}>
                                <step.icon size={40} className={step.color} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>{step.title}</h3>
                            <p className="leading-relaxed max-w-xs mx-auto" style={{ color: theme.textSecondary }}>
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ title, description, icon: Icon, benefits, delay }: any) => {
    const { theme } = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="group p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.gray2 }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Icon size={28} />
            </div>

            <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-500 transition-colors" style={{ color: theme.text }}>{title}</h3>
            <p className="leading-relaxed mb-6" style={{ color: theme.textSecondary }}>{description}</p>

            {benefits && (
                <ul className="space-y-3">
                    {benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-sm font-medium" style={{ color: theme.textSecondary }}>
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-green-500" />
                            </div>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            )}
        </motion.div>
    );
};

const Features = () => {
    const { theme } = useTheme();
    return (
        <section id="features" className="py-32 px-6" style={{ backgroundColor: theme.background }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:w-2/3"
                    >
                        {/* <span className="text-sm font-bold tracking-wider uppercase mb-3 block" style={{ color: theme.accent }}>Fonctionnalités</span> */}
                        <SectionHeading>Tout ce dont vous avez besoin pour réussir</SectionHeading>
                        <p className="text-xl" style={{ color: theme.textSecondary }}>Une suite d'outils IA complète pour transformer votre façon d'apprendre</p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Examens Blancs IA"
                        description="Simulez les conditions réelles d'examen avec des sujets générés par l'IA à partir de vos cours."
                        icon={FileText}
                        delay={0}
                        benefits={[
                            "Génération basée sur vos cours",
                            "Difficulté adaptative",
                            "Correction instantanée"
                        ]}
                    />
                    <FeatureCard
                        title="Quiz & Flashcards"
                        description="Mémorisez efficacement avec des outils de révision adaptatifs qui s'ajustent à vos progrès."
                        icon={Brain}
                        delay={0.1}
                        benefits={[
                            "Répétition espacée",
                            "Suivi de progression",
                            "Modes variés (QCM, Vrai/Faux)"
                        ]}
                    />
                    <FeatureCard
                        title="Mode Compétition"
                        description="Rendez l'apprentissage addictif avec des défis multijoueurs et des tournois."
                        icon={Trophy}
                        delay={0.2}
                        benefits={[
                            "Défis en temps réel",
                            "Classements mondiaux",
                            "Badges et récompenses"
                        ]}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <FeatureCard
                        title="Étude Personnalisée"
                        description="Notre IA identifie vos points faibles et crée des parcours d'apprentissage sur mesure pour optimiser votre temps."
                        icon={Target}
                        delay={0.3}
                        benefits={[
                            "Analyse de vos lacunes",
                            "Recommandations intelligentes",
                            "Plans d'étude optimisés"
                        ]}
                    />
                    <FeatureCard
                        title="Bibliothèque Communautaire"
                        description="Accédez à une bibliothèque grandissante de contenus partagés par la communauté d'étudiants Braina."
                        icon={BookOpen}
                        delay={0.4}
                        benefits={[
                            "Milliers de quiz publics",
                            "Partage facile",
                            "Collaboration entre étudiants"
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const { theme } = useTheme();
    const testimonials = [
        {
            name: "Marie L.",
            role: "Étudiante en Médecine",
            content: "Braina m'a permis de réduire mon temps de révision de 50% tout en améliorant mes notes. Les examens blancs sont d'une qualité incroyable !",
            rating: 5,
            avatar: "M",
            color: "bg-pink-500"
        },
        {
            name: "Jean-Pierre D.",
            role: "Étudiant en Droit",
            content: "Le mode multijoueur rend l'apprentissage tellement plus fun ! Je révise avec mes amis et on progresse ensemble sans s'en rendre compte.",
            rating: 5,
            avatar: "JP",
            color: "bg-blue-500"
        },
        {
            name: "Sophie M.",
            role: "Lycéenne - Terminale S",
            content: "Grâce à Braina, j'ai obtenu mon bac avec une moyenne de 17/20. Les quiz adaptatifs m'ont aidée à combler mes lacunes rapidement.",
            rating: 5,
            avatar: "S",
            color: "bg-purple-500"
        }
    ];

    return (
        <section className="py-32 px-6" style={{ backgroundColor: theme.background }}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    {/* <span className="text-sm font-bold tracking-wider uppercase mb-3 block" style={{ color: theme.accent }}>Témoignages</span> */}
                    <SectionHeading>Ils ont transformé leur façon d'apprendre</SectionHeading>
                    <p className="text-xl" style={{ color: theme.textSecondary }}>Rejoignez des milliers d'étudiants qui réussissent avec Braina</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-3xl border relative"
                            style={{ backgroundColor: theme.cardBg, borderColor: theme.gray2 }}
                        >
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-gray-500/10" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="mb-8 text-lg leading-relaxed font-medium" style={{ color: theme.textSecondary }}>"{testimonial.content}"</p>

                            <div className="flex items-center gap-4 border-t pt-6" style={{ borderColor: theme.gray2 }}>
                                <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-bold" style={{ color: theme.text }}>{testimonial.name}</div>
                                    <div className="text-sm" style={{ color: theme.textSecondary }}>{testimonial.role}</div>
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
    const { theme } = useTheme();

    return (
        <div className="border-b last:border-0" style={{ borderColor: theme.gray2 }}>
            <button
                className="w-full py-6 flex items-center justify-between text-left hover:text-purple-500 transition-colors group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-bold pr-8" style={{ color: theme.text }}>{question}</span>
                <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} w-8 h-8 rounded-full flex items-center justify-center bg-gray-500/10 group-hover:bg-purple-500/10`}>
                    <ChevronRight className={`w-5 h-5 ${isOpen ? 'text-purple-500' : 'text-gray-500'} transition-colors`} />
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
                        <p className="pb-8 leading-relaxed text-lg" style={{ color: theme.textSecondary }}>
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const { theme } = useTheme();
    const faqs = [
        {
            question: "Comment fonctionne la génération de quiz par l'IA ?",
            answer: "Braina utilise des modèles d'IA de pointe pour analyser vos documents de cours. Elle identifie les concepts clés, crée des questions de différents niveaux de difficulté et génère des distracteurs intelligents pour les QCM, le tout en quelques secondes."
        },
        {
            question: "Quels types de fichiers puis-je importer ?",
            answer: "Vous pouvez importer des images (JPG, PNG), des PDFs de cours, et bientôt des documents Word. Notre technologie OCR reconnaît le texte dans les images scannées, et l'IA peut comprendre aussi bien du texte que des schémas."
        },
        {
            question: "Est-ce vraiment gratuit ?",
            answer: "Oui ! Braina propose un plan gratuit généreux avec 50 quiz par mois et toutes les fonctionnalités de base. Les plans premium débloquent un nombre illimité de générations et des fonctionnalités avancées."
        },
        {
            question: "Puis-je utiliser Braina pour préparer un concours ?",
            answer: "Absolument ! Braina est parfait pour préparer le bac, les concours (médecine, écoles d'ingénieurs), les examens universitaires. Les examens blancs génèrent des conditions réalistes d'examen pour vous entraîner."
        }
    ];

    return (
        <section id="faq" className="py-32 px-6" style={{ backgroundColor: theme.background }}>
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {/* <span className="text-sm font-bold tracking-wider uppercase mb-3 block" style={{ color: theme.accent }}>FAQ</span> */}
                    <SectionHeading>Questions fréquentes</SectionHeading>
                </motion.div>

                <div className="bg-opacity-50 rounded-3xl p-8 border" style={{ backgroundColor: theme.cardBg, borderColor: theme.gray2 }}>
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTA = () => {
    const { theme } = useTheme();
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 -z-10" style={{ backgroundColor: theme.background }} />

            <div className="max-w-5xl mx-auto text-center relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] p-12 md:p-20 overflow-hidden"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 z-0" />
                    <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-10 z-0" />

                    {/* Content */}
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white tracking-tight">
                            Prêt à exceller dans vos études ?
                        </h2>
                        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-purple-100 font-medium">
                            Rejoignez la communauté Braina aujourd'hui. Commencez gratuitement, aucune carte bancaire requise.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/register">
                                <button className="h-16 px-10 rounded-full bg-white text-purple-900 font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-1 duration-300 flex items-center justify-center gap-2">
                                    Commencer gratuitement
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            </Link>
                            {/* <Link href="/demo-exam-screen">
                                <button className="h-16 px-10 rounded-full bg-purple-800/50 text-white border border-purple-400/30 font-bold text-lg hover:bg-purple-800/70 transition-colors backdrop-blur-sm flex items-center justify-center gap-2">
                                    Voir une démo
                                </button>
                            </Link> */}
                        </div>

                        <p className="text-sm text-purple-200 mt-10 font-medium opacity-80">
                            Gratuit pour toujours •  Aucune carte bancaire •  Configuration en 2 minutes
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer className="pt-24 pb-12 px-6 border-t" style={{ backgroundColor: theme.background, borderColor: theme.gray2 }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <ApplicationLogo size={48} withText={false} />
                            <span className="text-2xl font-bold" style={{ color: theme.text }}>Braina</span>
                        </Link>
                        <p className="max-w-xs mb-8 text-lg leading-relaxed" style={{ color: theme.textSecondary }}>
                            L'intelligence artificielle au service de votre réussite académique. Apprenez plus vite, retenez plus longtemps.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-purple-500 hover:text-white" style={{ backgroundColor: theme.cardBg, color: theme.textSecondary }}>
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6" style={{ color: theme.text }}>Produit</h4>
                        <ul className="space-y-4" style={{ color: theme.textSecondary }}>
                            <li><a href="#features" className="hover:text-purple-500 transition-colors">Fonctionnalités</a></li>
                            <li><a href="/demo-exam-screen" className="hover:text-purple-500 transition-colors">Démo</a></li>
                            <li><a href="#" className="hover:text-purple-500 transition-colors">Tarifs</a></li>
                            <li><a href="#" className="hover:text-purple-500 transition-colors">Entreprise</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6" style={{ color: theme.text }}>Ressources</h4>
                        <ul className="space-y-4" style={{ color: theme.textSecondary }}>
                            <li><a href="#" className="hover:text-purple-500 transition-colors">Blog</a></li>
                            <li><a href="#faq" className="hover:text-purple-500 transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-purple-500 transition-colors">Guide</a></li>
                            <li><a href="#" className="hover:text-purple-500 transition-colors">Communauté</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6" style={{ color: theme.text }}>Légal</h4>
                        <ul className="space-y-4" style={{ color: theme.textSecondary }}>
                            <li><Link href="/confidentialite" className="hover:text-purple-500 transition-colors">Confidentialité</Link></li>
                            <li><a href="#" className="hover:text-purple-500 transition-colors">CGU</a></li>
                            <li><a href="#" className="hover:text-purple-500 transition-colors">Mentions légales</a></li>
                            <li><a href="#" className="hover:text-purple-500 transition-colors">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderColor: theme.gray2 }}>
                    <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>© 2025 Braina.ai Tous droits réservés.</p>
                    <div className="flex gap-8 text-sm font-medium" style={{ color: theme.textSecondary }}>
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Systèmes opérationnels
                        </span>
                        <span>Fait avec ❤️ pour les étudiants</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const UserTypes = () => {
    const { theme } = useTheme();
    const users = [
        {
            title: "Étudiants",
            subtitle: "Boostez vos révisions",
            description: "Apprenez de manière plus intelligente. Profitez de quiz, de fiches et de notes générés par l'IA, adaptés à vos besoins d'apprentissage uniques. Économisez du temps, améliorez la rétention, réussissez vos examens avec facilité et défie tes amis en mode multijoueur.",
            icon: GraduationCap,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            action: "Commencer à réviser"
        },
        {
            title: "Professeurs",
            subtitle: "Gagnez du temps",
            description: "Élevez votre enseignement avec la génération de quiz, d'évaluations et d'examens alimentée par l'IA. Économisez du temps sur la création de contenu, la notation et améliorez l'engagement des étudiants.",
            icon: Presentation,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            action: "Créer un cours"
        },
        {
            title: "Entreprises",
            subtitle: "Formez vos équipes",
            description: "Créez rapidement des évaluations pour développer les connaissances et évaluer les compétences. Que ce soit pour dispenser des formations, concevoir des cours ou délivrer des certifications, nous avons la solution.",
            icon: Building2,
            color: "text-green-500",
            bg: "bg-green-500/10",
            action: "Solution entreprise"
        }
    ];

    return (
        <section className="py-32 px-6" style={{ backgroundColor: theme.background }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    {/* <span className="text-sm font-bold tracking-wider uppercase mb-3 block" style={{ color: theme.accent }}>Cibles</span> */}
                    <SectionHeading>Qui peut utiliser Braina ?</SectionHeading>
                    <p className="text-xl max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
                        Une solution adaptée à chaque besoin d'apprentissage et de formation
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {users.map((user, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-3xl border group hover:shadow-xl transition-all duration-300"
                            style={{ backgroundColor: theme.cardBg, borderColor: theme.gray2 }}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${user.bg} ${user.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <user.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>{user.title}</h3>
                            <p className="text-sm font-medium uppercase tracking-wide mb-4 opacity-70" style={{ color: theme.accent }}>{user.subtitle}</p>
                            <p className="leading-relaxed mb-8" style={{ color: theme.textSecondary }}>{user.description}</p>

                            {/* <div className="flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all cursor-pointer" style={{ color: theme.text }}>
                                {user.action} <ArrowRight size={16} />
                            </div> */}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SupportUs = () => {
    const { theme } = useTheme();

    return (
        <section className="py-24 px-6 border-y" style={{ backgroundColor: theme.background, borderColor: theme.gray2 }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* <span className="text-sm font-bold tracking-wider uppercase mb-3 block" style={{ color: theme.accent }}>Soutenez-nous</span> */}
                        <SectionHeading>Aidez Braina à grandir</SectionHeading>
                        <p className="text-xl mb-8" style={{ color: theme.textSecondary }}>
                            Braina est un projet ambitieux qui vise à révolutionner l'éducation. Votre soutien est essentiel pour nous permettre de continuer à innover.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-2" style={{ color: theme.text }}>Utilisez notre service</h4>
                                    <p style={{ color: theme.textSecondary }}>
                                        Plus vous utilisez Braina, plus notre IA apprend et s'améliore. Créez des quiz, partagez-les et invitez vos amis. C'est la meilleure façon de nous aider gratuitement.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center flex-shrink-0">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-2" style={{ color: theme.text }}>Faites un don</h4>
                                    <p style={{ color: theme.textSecondary }}>
                                        Le développement et les serveurs ont un coût. Vos dons nous permettent de rester indépendants et d'accélérer le développement de nouvelles fonctionnalités.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <Button variant="primary" className="gap-2">
                                <Heart size={18} /> Faire un don
                            </Button>
                            <Link href="/register">
                                <Button variant="outline">Commencer à utiliser</Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border" style={{ borderColor: theme.gray2 }}>
                            {/* Placeholder for an image or graphic representing community/support */}
                            <div className="aspect-square md:aspect-[4/3] bg-gray-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                                <Heart size={120} className="text-pink-500 animate-pulse relative z-10 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]" />

                                {/* Floating particles/icons */}
                                <motion.div
                                    animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-1/4 left-1/4 text-blue-400"
                                >
                                    <Zap size={30} />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                    className="absolute bottom-1/3 right-1/4 text-purple-400"
                                >
                                    <Users size={40} />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const Homepage = () => {
    const { theme } = useTheme();

    // Enable smooth scrolling globally for this page
    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    // Ensure we have a background color set on the main container
    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: theme.background, color: theme.text }}>
            <Navbar />
            <main>
                <Hero />
                {/* <TrustedBy /> */}
                <Stats />
                <HowItWorks />
                <UserTypes />
                <Features />
                <Testimonials />
                <FAQ />
                {/* <SupportUs /> */}
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default Homepage;