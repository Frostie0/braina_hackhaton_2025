import { Metadata } from 'next';
import QuizScreen from './QuizScreen';

export const metadata: Metadata = {
    title: 'Quiz - Braina',
    description: 'Testez vos connaissances avec nos quiz interactifs.',
};

const MOCK_QUIZ = {
    title: "Histoire Médiévale",
    questions: [
        {
            id: '1',
            type: 'multiple_choice',
            question: "Quel traité a officialisé le partage de l'empire carolingien ?",
            options: ["Traité de Rome", "Traité de Versailles", "Traité de Verdun", "Traité de Paris"],
            correctAnswer: "Traité de Verdun",
            explanation: "Le Traité de Verdun, signé en 843, a divisé l'empire carolingien entre les petits-fils de Charlemagne."
        },
        {
            id: '2',
            type: 'multiple_choice',
            question: "Comment appelle-t-on les anciens esclaves qui ont été libérés ?",
            options: ["Les serfs", "Les affranchis", "Les vassaux", "Les citoyens"],
            correctAnswer: "Les affranchis",
            explanation: "Les affranchis sont des anciens esclaves qui ont obtenu leur liberté."
        },
        {
            id: '3',
            type: 'multiple_choice',
            question: "Qui a été sacré empereur en l'an 800 ?",
            options: ["Clovis", "Charlemagne", "Louis XIV", "Napoléon"],
            correctAnswer: "Charlemagne",
            explanation: "Charlemagne a été sacré empereur d'Occident par le pape Léon III à Rome le jour de Noël de l'an 800."
        },
        {
            id: '4',
            type: 'true_false',
            question: "La peste noire a ravagé l'Europe au XIVe siècle.",
            options: ["Vrai", "Faux"],
            correctAnswer: "Vrai",
            explanation: "La peste noire (1347-1352) a tué entre 30% et 50% de la population européenne."
        },
        {
            id: '5',
            type: 'multiple_choice',
            question: "Quelle guerre a opposé la France et l'Angleterre pendant plus de 100 ans ?",
            options: ["Guerre de Trente Ans", "Guerre de Cent Ans", "Guerre des Deux-Roses", "Guerre de Succession"],
            correctAnswer: "Guerre de Cent Ans",
            explanation: "La guerre de Cent Ans a opposé les royaumes de France et d'Angleterre de 1337 à 1453."
        }
    ]
};

export default function QuizPage() {
    return <QuizScreen quiz={MOCK_QUIZ} />;
}