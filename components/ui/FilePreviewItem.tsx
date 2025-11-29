'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Image as ImageIcon, File } from 'lucide-react';

interface FilePreviewItemProps {
    file: File;
    onRemove: (fileName: string) => void;
}

export const FilePreviewItem: React.FC<FilePreviewItemProps> = ({ file, onRemove }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Cleanup function to revoke the URL when component unmounts or file changes
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    const getFileIcon = () => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-purple-400" />;
        if (file.type.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
        return <File className="w-8 h-8 text-yellow-400" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-shrink-0 w-32 h-32 relative group"
        >
            <div className="w-full h-full rounded-xl border border-gray-700 bg-gray-800 overflow-hidden flex flex-col items-center justify-center relative shadow-md">

                {/* Preview Image or Icon */}
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center h-full w-full">
                        <div className="mb-2">
                            {getFileIcon()}
                        </div>
                        <p className="text-xs text-gray-300 truncate w-full px-2 font-medium">
                            {file.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                            {Math.round((file.size / 1024 / 1024) * 100) / 100} Mo
                        </p>
                    </div>
                )}

                {/* Overlay gradient for text readability on images if needed, 
            but here we just show the image. 
            Maybe add a small name tag at bottom if it's an image? 
            Let's keep it clean as requested: "l'image doit etre affiche" */}
            </div>

            {/* Delete Button - Always visible or on hover? 
          User said "sur chaque image". Let's make it always visible or visible on hover/focus 
          for better UX on mobile (always visible might be better or tap to show).
          For now, top-right absolute position. */}
            <motion.button
                onClick={() => onRemove(file.name)}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition z-10 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                aria-label={`Supprimer ${file.name}`}
            >
                <X className="w-3.5 h-3.5" />
            </motion.button>
        </motion.div>
    );
};
