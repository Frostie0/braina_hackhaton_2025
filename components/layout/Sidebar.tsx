'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Home, Zap, MessageSquare, Award, Folder, Plus, ChevronDown, Bell, Search, BookOpen, Menu, X, Globe, User, Settings, Upload, CreditCard, LifeBuoy, LogOut } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

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

const profileMenuItems: NavItem[] = [
    { icon: Settings, label: 'Settings' },
    { icon: User, label: 'Personalization' },
    { icon: Upload, label: 'My Uploads' },
    { icon: CreditCard, label: 'Manage Subscription' },
    { icon: Globe, label: 'Change Language' },
    { icon: LifeBuoy, label: 'Support' },
    { icon: LogOut, label: 'Logout' },
];

// Sous-composant pour un élément de la barre latérale
const SidebarItem: React.FC<{ icon: React.ElementType; label: string; isActive?: boolean }> = ({ icon: Icon, label, isActive }) => (
    <div className={`flex items-center px-6 py-3 cursor-pointer transition-all duration-200 border-l-4 ${isActive
        ? 'bg-gradient-to-r from-purple-600/30 to-transparent text-white border-purple-500 font-semibold shadow-lg'
        : 'text-gray-400 border-transparent hover:bg-gray-700/50 hover:text-white hover:border-purple-500/30'
        }`}>
        <Icon className="w-5 h-5 mr-4" />
        <span className="text-sm">{label}</span>
    </div>
);

// Composant pour un élément du menu déroulant du profil
const ProfileMenuItem: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
    <div className="flex items-center px-6 py-2.5 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-transparent hover:text-white cursor-pointer transition-all duration-200">
        <Icon className="w-4 h-4 mr-3" />
        <span>{label}</span>
    </div>
);

// Composant du Menu Déroulant du Profil avec animation
const dropdownVariants: Variants = {
    hidden: { opacity: 0, height: 0, y: 10, transition: { duration: 0.2 } },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3 } },
};

const ProfileDropdownMenu: React.FC = () => (
    <motion.div
        className="absolute bottom-[68px] left-0 w-full bg-gray-700/95 backdrop-blur-sm shadow-xl border-t border-gray-600 z-10"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={dropdownVariants}
        style={{ overflow: 'hidden' }}
    >
        {profileMenuItems.map((item) => (
            <ProfileMenuItem key={item.label} icon={item.icon} label={item.label} />
        ))}
    </motion.div>
);

// Composant UserProfileFooter avec rotation de l'icône
const UserProfileFooter: React.FC<{ onClick: () => void; isMenuOpen: boolean }> = ({ onClick, isMenuOpen }) => (
    <div
        className="flex items-center p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-700/30 to-transparent hover:from-gray-700/50 hover:to-transparent cursor-pointer transition-all duration-300 relative"
        onClick={onClick}
    >
        <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 blur-md rounded-full"></div>
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mr-3 ring-2 ring-purple-500/30">
                <BookOpen className="w-5 h-5 text-white" />
            </div>
        </div>
        <div className="flex-1 text-sm">
            <p className="text-white font-semibold leading-tight">Christan Denison Vic...</p>
            <p className="text-gray-400 text-xs">Account & settings</p>
        </div>
        {/* Rotation  de l'icône en fonction de l'état du menu */}
        <motion.div animate={{ rotate: isMenuOpen ? -180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
    </div>
);

// Header de la Sidebar avec le logo officiel - Design amélioré avec gradient
const SidebarHeader: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => (
    <div className="relative flex items-center justify-between p-5 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/20 to-transparent">
        {/* Effet de glow subtil */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent"></div>

        <div className="relative flex items-center gap-3">
            {/* Logo avec effet de glow */}
            <div className="relative">
                <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full"></div>
                <Image
                    src="/assets/img/logo_white.png"
                    alt="Braina Logo"
                    width={36}
                    height={36}
                    className="relative object-contain"
                />
            </div>
            <span className='text-white font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent'>
                BRAINA
            </span>
        </div>
        {/* Le bouton X est visible uniquement sur mobile (lg:hidden) */}
        <button
            onClick={onToggle}
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 lg:hidden transition-all duration-200"
        >
            <X className="w-5 h-5" />
        </button>
    </div>
);

// Les variantes de Framer Motion pour la sidebar elle-même
const sidebarVariants: Variants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
};

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isDesktop: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, isDesktop }) => {

    // État de gestion de l'ouverture du menu de profil
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(prev => !prev);
    };

    // Le contenu qui sera dans l'aside (commun aux deux modes: desktop et mobile)
    const sidebarContent = (
        <div className="flex flex-col h-full relative">

            <div className="flex flex-col flex-1 overflow-y-auto">
                {/* Header pour mobile (avec bouton de fermeture) */}
                <SidebarHeader
                    onToggle={() => setIsSidebarOpen(false)}
                />

                {/* Top Bar (Recherche/Notifications) avec design amélioré */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/50 blur-md rounded-full"></div>
                            <div className="relative flex items-center justify-center w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full text-xs font-bold text-white shadow-lg">
                                0
                            </div>
                        </div>
                        <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                        <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>

                {/* Navigation Principale */}
                <nav className="mt-4">
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
                            <Plus className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        </div>
                        <div className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors mt-1">
                            <Folder className="w-5 h-5 mr-4" />
                            <span className="text-sm">Recent</span>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Menu Déroulant du Profil (affiché au-dessus du footer) */}
            <AnimatePresence>
                {isProfileMenuOpen && <ProfileDropdownMenu />}
            </AnimatePresence>

            {/* Footer du profil utilisateur */}
            <UserProfileFooter
                onClick={toggleProfileMenu}
                isMenuOpen={isProfileMenuOpen}
            />
        </div>
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
            {sidebarContent}
        </motion.aside>
    );
}