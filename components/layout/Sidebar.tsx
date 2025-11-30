'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { serverIp } from '@/lib/serverIp';
import { getUserId } from '@/lib/storage/userStorage';
import { Home, Zap, MessageSquare, Award, Folder, Plus, ChevronDown, Bell, Search, BookOpen, X, Globe, User, Settings, Upload, CreditCard, LifeBuoy, LogOut, TrendingUp } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import ApplicationLogo from '@/components/ui/ApplicationLogo';

// Interfaces
interface User {
    _id: string;
    userId: string;
    name: string;
    email: string;
    profile?: string;
}

interface NavItem {
    icon: React.ElementType;
    label: string;
}

const mainNavItems: NavItem[] = [
    { icon: Home, label: 'Accueil' },
    { icon: Zap, label: 'Générer' },
    { icon: TrendingUp, label: 'Analytics' },
];

const profileMenuItems: NavItem[] = [
    { icon: Settings, label: 'Paramètres' },
    // { icon: User, label: 'Personnalisation' },
    // { icon: Upload, label: 'Mes Uploads' },
    // { icon: CreditCard, label: 'Abonnement' },
    { icon: Globe, label: 'Langue' },
    // { icon: LifeBuoy, label: 'Support' },
    { icon: LogOut, label: 'Déconnexion' },
];

// Sous-composant pour un élément de la barre latérale
const SidebarItem: React.FC<{ icon: React.ElementType; label: string; isActive?: boolean; onClick?: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 group ${isActive
            ? 'bg-white/10 text-white font-medium'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
        <span className="text-sm tracking-wide">{label}</span>
    </div>
);

// Composant pour un élément du menu déroulant du profil
const ProfileMenuItem: React.FC<{ icon: React.ElementType; label: string; onClick?: () => void }> = ({ icon: Icon, label, onClick }) => (
    <div onClick={onClick} className="flex items-center px-4 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors duration-200">
        <Icon className="w-4 h-4 mr-3" />
        <span>{label}</span>
    </div>
);

// Composant du Menu Déroulant du Profil avec animation
const dropdownVariants: Variants = {
    hidden: { opacity: 0, height: 0, y: 5, transition: { duration: 0.2 } },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.2 } },
};

const ProfileDropdownMenu: React.FC<{ onNavigate: (path: string) => void; onLogout: () => void }> = ({ onNavigate, onLogout }) => {
    const handleMenuClick = (label: string) => {
        switch (label) {
            case 'Paramètres':
                onNavigate('/settings');
                break;
            case 'Langue':
                onNavigate('/language');
                break;
            case 'Déconnexion':
                onLogout();
                break;
            default:
                break;
        }
    };

    return (
        <motion.div
            className="absolute bottom-[70px] left-2 right-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
        >
            <div className="py-1">
                {profileMenuItems.map((item) => (
                    <ProfileMenuItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => handleMenuClick(item.label)}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// Header de la Sidebar
const SidebarHeader: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => (
    <div className="flex items-center justify-between px-6 py-6">
        <ApplicationLogo size={52} />
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

// Composant UserProfileFooter
const UserProfileFooter: React.FC<{ onClick: () => void; isMenuOpen: boolean; user: User | null; isLoading: boolean }> = ({ onClick, isMenuOpen, user, isLoading }) => {
    // Get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            className="flex items-center p-3 mx-2 mb-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors duration-200 group"
            onClick={onClick}
        >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-purple-900/20">
                <span className="text-xs font-bold text-white">
                    {isLoading ? '...' : user ? getInitials(user.name) : 'G'}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-purple-200 transition-colors">
                    {isLoading ? (
                        'Chargement...'
                    ) : user ? (
                        user.name
                    ) : (
                        'Invité'
                    )}
                </p>
                <p className="text-xs text-gray-500 truncate">Compte & paramètres</p>
            </div>
            <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
            </motion.div>
        </div>
    );
};

// ... (SidebarHeader and variants code)

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, isDesktop }) => {

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = getUserId();
                if (userId) {
                    const response = await axios.get(`${serverIp}/user/getUser/${userId}`);
                    if (response.status === 200) {
                        setUser(response.data.user);
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUserData();
    }, []);

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(prev => !prev);
    };

    const handleNavigate = (path: string) => {
        router.push(path);
        setIsProfileMenuOpen(false);
        if (!isDesktop) setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        // Clear storage
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to homepage
        router.push('/');
        setIsProfileMenuOpen(false);
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
                            isActive={item.label === 'Accueil' && pathname === '/dashboard' || item.label === 'Analytics' && pathname.includes('/analytics')}
                            onClick={() => {
                                if (item.label === 'Accueil') router.push('/dashboard');
                                else if (item.label === 'Générer') router.push('/generate-quiz');
                                else if (item.label === 'Analytics') router.push('/analytics');
                                if (!isDesktop) setIsSidebarOpen(false);
                            }}
                        />
                    ))}
                    {/* Lien pour rejoindre une partie multijoueur */}
                    <SidebarItem
                        icon={BookOpen}
                        label="Rejoindre une partie"
                        onClick={() => {
                            router.push('/multiplayer/join');
                            if (!isDesktop) setIsSidebarOpen(false);
                        }}
                    />
                </nav>
            </div>

            {/* Footer Profil */}
            <div className="relative mt-auto">
                <AnimatePresence>
                    {isProfileMenuOpen && <ProfileDropdownMenu onNavigate={handleNavigate} onLogout={handleLogout} />}
                </AnimatePresence>
                <UserProfileFooter
                    onClick={toggleProfileMenu}
                    isMenuOpen={isProfileMenuOpen}
                    user={user}
                    isLoading={isLoadingUser}
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