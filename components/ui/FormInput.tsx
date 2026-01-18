'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FormInputProps {
    id: string;
    type?: 'text' | 'email';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    className?: string;
    icon?: React.ElementType;
}

/**
 * Composant FormInput réutilisable pour les champs de formulaire
 */
export const FormInput: React.FC<FormInputProps> = ({
    id,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    label,
    error,
    required = true,
    className = '',
    icon: Icon,
}) => {
    const baseInputClasses = `w-full h-11 rounded-xl bg-gray-900/60 border ${Icon ? 'pl-10' : 'px-4'} pr-4 text-white placeholder-gray-500 outline-none transition duration-300 ${error
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
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <motion.input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={baseInputClasses}
                    required={required}
                    whileFocus={{ scale: 1.01 }}
                />
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

export default FormInput;
