import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PlayScreen from './PlayScreen';

export const metadata: Metadata = {
    title: 'Jouer - Braina',
    description: 'Jouez à votre quiz dans le mode de votre choix.',
};

interface PageProps {
    params: Promise<{
        mode: string;
        id: string;
    }>;
    searchParams: Promise<{
        questions?: string;
        shuffle?: string;
        roomCode?: string;
        isHost?: string;
    }>;
}

export default async function PlayPage({ params, searchParams }: PageProps) {
    const { mode, id } = await params;
    const { questions, shuffle, roomCode, isHost } = await searchParams;

    // Validate mode
    const validModes = ['quiz', 'flashcards', 'exam', 'multiplayer'] as const;
    if (!validModes.includes(mode as any)) {
        redirect('/dashboard');
    }

    const config = {
        mode: mode as 'quiz' | 'flashcards' | 'exam' | 'multiplayer',
        quizId: id,
        questionsPerSession: questions ? parseInt(questions) : 10,
        shuffleQuestions: shuffle === 'true',
        roomCode: roomCode,
        isHost: isHost === 'true'
    };

    return <PlayScreen config={config} />;
}
