import { Metadata } from 'next';
import GenerateQuizClient from './GenerateQuizClient';

export const metadata: Metadata = {
    title: 'Générer un Quiz',
    description: 'Téléversez vos documents et laissez l\'IA générer un quiz interactif pour vous.',
};

export default function GenerateQuizPage() {
    return <GenerateQuizClient />;
}