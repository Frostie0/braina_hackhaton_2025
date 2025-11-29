'use client';

// L'IMPORTATION DE useEffect EST CRUCIALE POUR RÉGLER L'ERREUR SSR
import React, { useState, useEffect } from 'react';
import { Zap, Mic, BookOpen, Menu, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Sidebar } from '../components/layout/Sidebar';
import { RightPanel, RightPanelMobile } from '../components/layout/RightPanel';
import { QuickStartCard } from '../components/ui/QuickStartCard';
import QuizFlatList from '../components/ui/QuizFlatList'; // NOUVEAU: Import du FlatList
import { quizData } from '@/lib/data/quiz'; // NOUVEAU: Import des données


// Le composant principal
export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Initialisé à FALSE: Le serveur ne sait pas la taille de l'écran
  const [isDesktop, setIsDesktop] = useState(false);
  // NOUVEL ÉTAT: Devient TRUE uniquement après le montage côté client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 1. Définir que nous sommes montés sur le client
    setIsClient(true);

    // 2. Cette fonction vérifie si l'écran est large (Desktop)
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Exécution initiale
    handleResize();

    // Écoute les changements de taille de fenêtre
    window.addEventListener('resize', handleResize);

    // Nettoyage de l'écouteur
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // [] garantit que cela ne s'exécute qu'une fois au montage

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">

      {/* Utiliser AnimatePresence pour le menu mobile et l'overlay */}
      <AnimatePresence initial={false}>

        {/* 1. Overlay pour mobile (apparaît uniquement quand la sidebar est ouverte ET ce n'est PAS un desktop) */}
        {/* On s'assure que isClient est true avant de rendre la logique conditionnelle */}
        {isClient && isSidebarOpen && !isDesktop && (
          <motion.div
            key="sidebar-overlay"
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* 2. Sidebar: Rendu si isSidebarOpen est vrai (mobile) OU si c'est un desktop */}
        {/* Le rendu est BLOQUÉ pendant le SSR par le check isClient */}
        {isClient && (isSidebarOpen || isDesktop) && (
          <Sidebar
            key="sidebar"
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isDesktop={isDesktop} // PASSAGE DE LA PROP isDesktop
          />
        )}

      </AnimatePresence>

      {/* Conteneur principal */}
      <div className="flex-1 flex flex-col overflow-y-auto">

        {/* Topbar Mobile (Menu Hamburger & Logo) */}
        <header className="flex lg:hidden items-center justify-between p-4 bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
          <div className="flex items-center text-xl font-extrabold text-purple-400">
            <Globe className="w-6 h-6 mr-2 text-purple-500" />
            BRAINA
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Colonne 2: Contenu Principal */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">

          {/* Titre d'accueil */}
          <h1 className="text-3xl font-bold mb-4 md:mb-8 text-white">Welcome Christan Denison Victor!</h1>


          {/* Section Quick Start */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-300 border-l-4 border-purple-500 pl-3">Quick start</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <QuickStartCard
                icon={Zap}
                title="Generate"
                description="Transform anything into flashcards, quizzes and podcasts."
              />
              <QuickStartCard
                icon={BookOpen}
                title="Chat to PDF"
                description="Upload your document and ask or generate from it."
              />
              <QuickStartCard
                icon={Mic}
                title="Record"
                description="Record audio directly or upload audio files to generate from."
              />
            </div>
          </section>

          {/* SECTION: CONTINUER L'APPRENTISSAGE (Quiz FlatList avec tri) */}
          <QuizFlatList quizzes={quizData} title="Continuer l'apprentissage" />

          {/* Panneau de droite sur Mobile (affiché en bas du contenu) */}
          <RightPanelMobile />

        </main>
      </div>


      {/* Colonne 3: Panneau de Droite (Affiché uniquement sur Grand Écran) */}
      <RightPanel />

    </div>
  );
}