import { Metadata } from 'next';
import GenerateExamClient from './GenerateExamClient';

export const metadata: Metadata = {
    title: 'Générer un Examen Blanc | Braina',
    description: 'Créez des examens blancs personnalisés à partir de vos notes et documents.',
};

export default function GenerateExamPage() {
    return <GenerateExamClient />;
}
