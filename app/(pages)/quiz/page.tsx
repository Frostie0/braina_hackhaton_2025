import { Metadata } from 'next';
import QuizScreen from './QuizScreen';

export const metadata: Metadata = {
    title: 'Générer un Quiz',
    description: 'Téléversez vos documents et laissez l\'IA générer un quiz interactif pour vous.',
};

export default function QuizScreenPage({ params }: { params: { quizId: string } }) {
    return <QuizScreen quizId={params.quizId} />;
}