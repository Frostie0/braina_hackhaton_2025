'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Home, Zap, MessageSquare, Award, Folder, Plus, ChevronDown, Bell, Search, BookOpen, Menu, X, Globe, User, Settings, Upload, CreditCard, LifeBuoy, LogOut } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion'; // Import AnimatePresence

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
        ? 'bg-purple-600/30 text-white border-purple-500 font-semibold'
        : 'text-gray-400 border-transparent hover:bg-gray-700/50 hover:text-white'
        }`}>
        <Icon className="w-5 h-5 mr-4" />
        <span className="text-sm">{label}</span>
    </div>
);

// Composant pour un élément du menu déroulant du profil
const ProfileMenuItem: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
    <div className="flex items-center px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">
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
        className="absolute bottom-[68px] left-0 w-full bg-gray-700 shadow-xl border-t border-gray-600 z-10"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={dropdownVariants}
        // Pour s'assurer que le contenu est masqué lorsqu'il n'est pas affiché
        style={{ overflow: 'hidden' }}
    >
        {profileMenuItems.map((item) => (
            <ProfileMenuItem key={item.label} icon={item.icon} label={item.label} />
        ))}
    </motion.div>
);


// Composant UserProfileFooter, maintenant avec gestion du clic et rotation de l'icône
const UserProfileFooter: React.FC<{ onClick: () => void; isMenuOpen: boolean }> = ({ onClick, isMenuOpen }) => (
    <div
        className="flex items-center p-4 border-t border-gray-700 bg-gray-700/30 hover:bg-gray-700 cursor-pointer transition-colors relative"
        onClick={onClick}
    >
        <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center mr-3">
            <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-sm">
            <p className="text-white font-semibold leading-tight">Christan Denison Vic...</p>
            <p className="text-gray-400 text-xs">Account & settings</p>
        </div>
        {/* Rotation de l'icône en fonction de l'état du menu */}
        <motion.div animate={{ rotate: isMenuOpen ? -180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
    </div>
);

// Header de la Sidebar avec le logo officiel
const SidebarHeader: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => (
    <div className="flex items-center justify-between p-4 text-xl font-extrabold border-b border-gray-700 text-purple-400">
        <div className="flex items-center gap-2">
            {/* Logo officiel de l'application */}
            <Image
                src="/assets/img/logo_white.png"
                alt="Braina Logo"
                width={32}
                height={32}
                className="object-contain"
            />
            <span className='text-white'>BRAINA</span>
        </div>
        {/* Le bouton X est visible uniquement sur mobile (lg:hidden) */}
        <button onClick={onToggle} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 lg:hidden">
            <X className="w-6 h-6" /> {/* Bouton de fermeture mobile */}
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
    isDesktop: boolean; // Reçu comme prop
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, isDesktop }) => {

    // NOUVEL ÉTAT: Gestion de l'ouverture du menu de profil
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(prev => !prev);
    };

    // Le contenu qui sera dans l'aside (commun aux deux modes: desktop et mobile)
    const sidebarContent = (
        <div className="flex flex-col h-full relative"> {/* Ajout de relative pour positionner le menu déroulant */}

            <div className="flex flex-col flex-1 overflow-y-auto">
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
                            <Plus className="w-4 h-4 cursor-pointer hover:text-white" />
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