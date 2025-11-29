'use client';

import React, { useState } from 'react';
import { Home, Zap, MessageSquare, Award, Folder, Plus, ChevronDown, Bell, Search, BookOpen, X, Globe, User, Settings, Upload, CreditCard, LifeBuoy, LogOut } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import ApplicationLogo from '@/components/ui/ApplicationLogo';

// Interfaces
interface NavItem {
    icon: React.ElementType;
    label: string;
}

const mainNavItems: NavItem[] = [
    { icon: Home, label: 'Accueil' },
    { icon: Zap, label: 'Générer' },
    { icon: MessageSquare, label: 'Chat' },
    { icon: Award, label: 'Classement' },
];

const profileMenuItems: NavItem[] = [
    { icon: Settings, label: 'Paramètres' },
    { icon: User, label: 'Personnalisation' },
    { icon: Upload, label: 'Mes Uploads' },
    { icon: CreditCard, label: 'Abonnement' },
    { icon: Globe, label: 'Langue' },
    { icon: LifeBuoy, label: 'Support' },
    { icon: LogOut, label: 'Déconnexion' },
];

// Sous-composant pour un élément de la barre latérale
const SidebarItem: React.FC<{ icon: React.ElementType; label: string; isActive?: boolean }> = ({ icon: Icon, label, isActive }) => (
    <div className={`flex items-center px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 group ${isActive
        ? 'bg-white/10 text-white font-medium'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}>
        <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
        <span className="text-sm tracking-wide">{label}</span>
    </div>
);

// Composant pour un élément du menu déroulant du profil
const ProfileMenuItem: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
    <div className="flex items-center px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors duration-200">
        <Icon className="w-4 h-4 mr-3" />
        <span>{label}</span>
    </div>
);

// Composant du Menu Déroulant du Profil avec animation
const dropdownVariants: Variants = {
    hidden: { opacity: 0, height: 0, y: 5, transition: { duration: 0.2 } },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.2 } },
};

const ProfileDropdownMenu: React.FC = () => (
    <motion.div
        className="absolute bottom-[70px] left-2 right-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={dropdownVariants}
    >
        <div className="py-1">
            {profileMenuItems.map((item) => (
                <ProfileMenuItem key={item.label} icon={item.icon} label={item.label} />
            ))}
        </div>
    </motion.div>
);

// Composant UserProfileFooter
const UserProfileFooter: React.FC<{ onClick: () => void; isMenuOpen: boolean }> = ({ onClick, isMenuOpen }) => (
    <div
        className="flex items-center p-3 mx-2 mb-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors duration-200 group"
        onClick={onClick}
    >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-purple-900/20">
            <span className="text-xs font-bold text-white">CD</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-purple-200 transition-colors">Christan Denison</p>
            <p className="text-xs text-gray-500 truncate">Compte & paramètres</p>
        </div>
        <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
        </motion.div>
    </div>
);

// Header de la Sidebar
const SidebarHeader: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => (
    <div className="flex items-center justify-between px-6 py-6">
        <ApplicationLogo size={24} />
        <button
            onClick={onToggle}
            className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
    </div>
);

// Les variantes de Framer Motion pour la sidebar
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

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(prev => !prev);
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-black border-r border-white/10">
            {/* Header */}
            <SidebarHeader onToggle={() => setIsSidebarOpen(false)} />

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2">
                <nav className="space-y-0.5">
                    {mainNavItems.map((item) => (
                        <SidebarItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            isActive={item.label === 'Accueil'}
                        />
                    ))}
                </nav>

                {/* Section Dossiers (Style épuré) */}
                <div className="mt-10 px-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dossiers</span>
                        <Plus className="w-3.5 h-3.5 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors py-1.5 group">
                            <Folder className="w-4 h-4 mr-3 text-gray-600 group-hover:text-gray-400" />
                            <span className="text-sm">Récents</span>
                        </div>
                        <div className="flex items-center text-gray-400 hover:text-white cursor-pointer transition-colors py-1.5 group">
                            <Folder className="w-4 h-4 mr-3 text-gray-600 group-hover:text-gray-400" />
                            <span className="text-sm">Mathématiques</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Profil */}
            <div className="relative mt-auto">
                <AnimatePresence>
                    {isProfileMenuOpen && <ProfileDropdownMenu />}
                </AnimatePresence>
                <UserProfileFooter
                    onClick={toggleProfileMenu}
                    isMenuOpen={isProfileMenuOpen}
                />
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <aside className="w-64 flex-shrink-0 h-full">
                {sidebarContent}
            </aside>
        );
    }

    return (
        <motion.aside
            className="w-64 flex-shrink-0 h-full fixed top-0 left-0 z-50"
            initial="closed"
            animate={isSidebarOpen ? "open" : "closed"}
            variants={sidebarVariants}
        >
            {sidebarContent}
        </motion.aside>
    );
}