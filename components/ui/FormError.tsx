'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FormErrorProps {
    error?: string;
    className?: string;
}

/**
 * Composant FormError pour afficher les messages d'erreur généraux
 */
export const FormError: React.FC<FormErrorProps> = ({ error, className = '' }) => {
    if (!error) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm ${className}`}
        >
            {error}
        </motion.div>
    );
};

export default FormError;
