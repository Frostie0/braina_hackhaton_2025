import React from 'react';


interface ApplicationLogoProps {
    className?: string;
    size?: number;
    withText?: boolean;
}

const ApplicationLogo: React.FC<ApplicationLogoProps> = ({ className = "", size = 24, withText = true }) => {
    return (
        <div className={`flex items-center ${className}`}>
            <div className="relative flex items-center justify-center">
                <img
                    src="/assets/img/logo_white.png"
                    alt="Braina Logo"
                    style={{ width: size, height: size, objectFit: 'contain' }}
                />
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
