'use client';

import React from 'react';
import { Home, Zap, MessageSquare, Award, Folder, Plus, ChevronDown, Bell, Search, BookOpen, Menu, X, Globe } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

// Interfaces
interface NavItem {
    icon: React.ElementType;
    label: string;
}

const mainNavItems: NavItem[] = [
    { icon: Home, label: 'Home' },
    { icon: Zap, label: 'Generate' },
    { icon: MessageSquare, label: 'Chat' },
    { icon: Award, label: 'Leaderboards' },
];

// Sous-composant pour un élément de la barre latérale
const SidebarItem: React.FC<{ icon: React.ElementType; label: string; isActive?: boolean }> = ({ icon: Icon, label, isActive }) => (
    <div className={`flex items-center px-6 py-3 cursor-pointer transition-all duration-200 border-l-4 ${isActive
            ? 'bg-purple-600/30 text-white border-purple-500 font-semibold'
            : 'text-gray-400 border-transparent hover:bg-gray-700/50 hover:text-white'
        }`}>
        <Icon className="w-5 h-5 mr-4" />
        <span className="text-sm">{label}</span>
    </div>
);

// Sous-composant pour l'icône de profil en bas
const UserProfileFooter: React.FC = () => (
    <div className="flex items-center p-4 border-t border-gray-700 bg-gray-700/30 hover:bg-gray-700 cursor-pointer transition-colors">
        <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center mr-3">
            <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-sm">
            <p className="text-white font-semibold leading-tight">Christan Denison Vic...</p>
            <p className="text-gray-400 text-xs">Account & settings</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
);

// CORRECTION DANS LE HEADER: Utilisation de lg:hidden sur le bouton X pour le masquer sur desktop
const SidebarHeader: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => (
    <div className="flex items-center justify-between p-4 text-xl font-extrabold border-b border-gray-700 text-purple-400">
        <div className="flex items-center">
            <Globe className="w-6 h-6 mr-2 text-purple-500" /> {/* Logo de l'app (icône) */}
            <span>BRAINA</span>
        </div>
        {/* Le bouton X est visible uniquement sur mobile (lg:hidden) */}
        <button onClick={onToggle} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 lg:hidden">
            <X className="w-6 h-6" /> {/* Bouton de fermeture mobile */}
        </button>
    </div>
);

// Les variantes de Framer Motion
const sidebarVariants: Variants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isDesktop: boolean; // NOUVEAU: Recevoir isDesktop comme prop
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, isDesktop }) => {

    // Contenu commun de la sidebar
    const sidebarContent = (
        <>
            <div className="flex flex-col h-full">
                {/* Header pour mobile (avec bouton de fermeture) */}
                <SidebarHeader
                    onToggle={() => setIsSidebarOpen(false)}
                />

                {/* Top Bar (Recherche/Notifications) */}
                <div className="flex p-4 space-x-4 border-b border-gray-700">
                    <div className="flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full text-xs font-bold text-white shadow-md">0</div>
                    <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                    <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                </div>

                {/* Navigation Principale */}
                <nav className="mt-4 flex-1 overflow-y-auto">
                    {mainNavItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            isActive={item.label === 'Home'}
                        />
                    ))}

                    {/* Section Dossiers */}
                    <div className="mt-8 px-6">
                        <div className="flex justify-between items-center text-gray-400 mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider">Folders</span>
                            <Plus className="w-4 h-4 cursor-pointer hover:text-white" />
                        </div>
                        <div className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors mt-1">
                            <Folder className="w-5 h-5 mr-4" />
                            <span className="text-sm">Recent</span>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Footer du profil utilisateur */}
            <UserProfileFooter />
        </>
    );

    // Sur DESKTOP: utilisez un aside normal sans animation
    if (isDesktop) {
        return (
            <aside className="w-64 bg-gray-800 flex-shrink-0 flex flex-col justify-between h-full border-r border-gray-700">
                {sidebarContent}
            </aside>
        );
    }

    // Sur MOBILE: utilisez motion.aside avec animation
    return (
        <motion.aside
            className="w-64 bg-gray-800 flex-shrink-0 flex flex-col justify-between h-full border-r border-gray-700 fixed top-0 left-0 z-50"
            initial="closed"
            animate={isSidebarOpen ? "open" : "closed"}
            variants={sidebarVariants}
        >
            <div className="flex flex-col h-full">
                {/* Header pour mobile (avec bouton de fermeture) */}
                <SidebarHeader
                    onToggle={() => setIsSidebarOpen(false)}
                />

                {/* Top Bar (Recherche/Notifications) */}
                <div className="flex p-4 space-x-4 border-b border-gray-700">
                    <div className="flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full text-xs font-bold text-white shadow-md">0</div>
                    <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                    <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                </div>

                {/* Navigation Principale */}
                <nav className="mt-4 flex-1 overflow-y-auto">
                    {mainNavItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            isActive={item.label === 'Home'}
                        />
                    ))}

                    {/* Section Dossiers */}
                    <div className="mt-8 px-6">
                        <div className="flex justify-between items-center text-gray-400 mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider">Folders</span>
                            <Plus className="w-4 h-4 cursor-pointer hover:text-white" />
                        </div>
                        <div className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors mt-1">
                            <Folder className="w-5 h-5 mr-4" />
                            <span className="text-sm">Recent</span>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Footer du profil utilisateur */}
            <UserProfileFooter />
        </motion.aside>
    );
}