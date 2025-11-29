import React from 'react';
import { Metadata } from 'next';
import ForgotPasswordClient from './ForgotPasswordClient';

export const metadata: Metadata = {
    title: 'Mot de passe oublié',
    description: 'Réinitialisez votre mot de passe Braina',
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordClient />;
}
