'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Définition de la police Poppins (simulée avec Tailwind/CSS standard pour cet environnement)
// En Next.js, vous importeriez la police comme dans votre exemple, mais ici, 
// nous utilisons des classes Tailwind standard (font-sans) et les configurations de style global.

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout pour toutes les pages d'authentification (Connexion, Inscription, etc.).
 * Fournit l'arrière-plan, le centrage et la cohérence de la marque (Logo BRAINA).
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-900"
      style={{
        // Gradient personnalisé pour un effet "dark mode" premium
        background: 'radial-gradient(circle at 10% 20%, rgb(40, 44, 52) 0%, rgb(16, 20, 27) 90%)',
      }}
    >
      {/* Conteneur principal centré */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo de la marque au-dessus du formulaire */}
        <div className="flex items-center justify-center mb-8">
            <Image src="/assets/img/logo_white.png" alt="Logo BRAINA" width={50} height={50} />
            <span className="text-3xl font-extrabold text-white">BRAINA</span>
        </div>

        {/* Le contenu (formulaire de connexion, etc.) est inséré ici */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl p-6 md:p-8">
            {children}
        </div>
      </motion.div>
      
      {/* Note de pied de page optionnelle */}
      <div className="mt-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BRAINA. All rights reserved.
      </div>
    </div>
  );
};