'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface PasswordInputProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    className?: string;
}

/**
 * Composant PasswordInput réutilisable avec toggle de visibilité
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
    id,
    value,
    onChange,
    placeholder = '••••••••',
    label = 'Mot de passe',
    error,
    required = true,
    className = '',
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const baseInputClasses = `w-full h-11 rounded-xl bg-gray-900/60 border px-4 pr-12 text-white placeholder-gray-500 outline-none transition duration-300 ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
            : 'border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
        }`;

    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-gray-200 text-sm font-medium mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <motion.input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={baseInputClasses}
                    required={required}
                    whileFocus={{ scale: 1.01 }}
                />

                {/* Bouton toggle visibilité */}
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Message d'erreur */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400 flex items-center gap-1"
                >
                    <span className="text-red-500">⚠</span>
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default PasswordInput;
