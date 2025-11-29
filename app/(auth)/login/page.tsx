import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
    title: 'Connexion',
    description: 'Connectez-vous à votre compte Braina pour accéder à vos quiz et flashcards.',
};

export default function LoginPage() {
    return <LoginClient />;
}
