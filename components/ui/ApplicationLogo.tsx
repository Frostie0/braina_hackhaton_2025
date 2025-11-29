import React from 'react';
import { Zap } from 'lucide-react';

interface ApplicationLogoProps {
    className?: string;
    size?: number;
    withText?: boolean;
}

const ApplicationLogo: React.FC<ApplicationLogoProps> = ({ className = "", size = 24, withText = true }) => {
    return (
        <div className={`flex items-center ${className}`}>
            <div className="relative flex items-center justify-center">
                <Zap size={size} className="text-purple-500 fill-purple-500/20" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full" />
            </div>
            {withText && (
                <span className="ml-2 font-bold text-xl tracking-tight text-white font-serif">
                    Braina
                </span>
            )}
        </div>
    );
};

export default ApplicationLogo;
