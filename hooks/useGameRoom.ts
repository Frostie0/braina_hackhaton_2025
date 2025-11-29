import { useState, useCallback, useEffect } from 'react';
import { useSocket, useSocketEvent } from './useSocket';
import { SOCKET_EVENTS } from '@/lib/config';

interface Player {
    userId: string;
    userName: string;
    socketId: string;
    score: number;
    isHost: boolean;
    isConnected: boolean;
    answeredQuestions: Array<{
        questionIndex: number;
        answer: any;
        isCorrect: boolean;
        timeSpent: number;
    }>;
}

interface Question {
    type: string;
    question: string;
    options: string[];
    correctAnswer: any;
    explanation: string;
}

interface GameRoom {
    gameCode: string;
    hostId: string;
    players: Player[];
    questions: Question[];
    settings: {
        maxPlayers: number;
        timePerQuestion: number;
        totalQuestions: number;
        difficulty: string;
        category: string;
    };
    gameState: 'waiting' | 'playing' | 'ended';
    currentQuestionIndex: number;
    startTime?: Date;
    endTime?: Date;
    questionStartTime?: Date;
    finalResults?: any[];
}

interface UseGameRoomReturn {
    gameRoom: GameRoom | null;
    isLoading: boolean;
    error: string | null;
    joinGame: (gameCode: string, userId: string, userName: string, isHost?: boolean) => void;
    startGame: () => void;
    submitAnswer: (answer: any, timeSpent: number) => void;
    nextQuestion: () => void;
    currentPlayer: Player | null;
    isHost: boolean;
}

/**
 * Hook pour gérer la logique de salle de jeu multijoueur
 */
export function useGameRoom(userId: string, userName: string): UseGameRoomReturn {
    const { socket, isConnected } = useSocket();
    const [gameRoom, setGameRoom] = useState<GameRoom | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Rejoindre une partie
    const joinGame = useCallback((gameCode: string, userId: string, userName: string, isHost: boolean = false) => {
        if (!socket || !isConnected) {
            setError('Socket non connecté');
            return;
        }

        console.log('🎮 Joining game:', { gameCode, userId, userName, isHost });
        setIsLoading(true);
        setError(null);

        socket.emit(SOCKET_EVENTS.JOIN_GAME, {
            gameCode: gameCode.toUpperCase(),
            userId,
            userName,
            isHost
        });
    }, [socket, isConnected]);

    // Démarrer la partie
    const startGame = useCallback(() => {
        if (!socket || !gameRoom) return;

        console.log('🚀 Starting game:', gameRoom.gameCode);
        socket.emit(SOCKET_EVENTS.START_GAME, {
            gameCode: gameRoom.gameCode
        });
    }, [socket, gameRoom]);

    // Soumettre une réponse
    const submitAnswer = useCallback((answer: any, timeSpent: number) => {
        if (!socket || !gameRoom) return;

        console.log('📝 Submitting answer:', { answer, timeSpent });
        socket.emit(SOCKET_EVENTS.SUBMIT_ANSWER, {
            gameCode: gameRoom.gameCode,
            userId,
            answer,
            timeSpent
        });
    }, [socket, gameRoom, userId]);

    // Passer à la question suivante
    const nextQuestion = useCallback(() => {
        if (!socket || !gameRoom) return;

        console.log('⏭️ Next question');
        socket.emit(SOCKET_EVENTS.NEXT_QUESTION, {
            gameCode: gameRoom.gameCode
        });
    }, [socket, gameRoom]);

    // Écouter les événements socket
    useSocketEvent(SOCKET_EVENTS.GAME_STATE, useCallback((data: GameRoom) => {
        console.log('📊 Game state received:', data);
        setGameRoom(data);
        setIsLoading(false);
        setError(null);
    }, []));

    useSocketEvent(SOCKET_EVENTS.PLAYER_JOINED, useCallback((data: { players: Player[] }) => {
        console.log('👥 Player joined:', data);
        setGameRoom(prev => prev ? { ...prev, players: data.players } : null);
    }, []));

    useSocketEvent(SOCKET_EVENTS.GAME_STARTED, useCallback((data: { startTime: Date; questionIndex: number }) => {
        console.log('🎬 Game started:', data);
        setGameRoom(prev => prev ? {
            ...prev,
            gameState: 'playing',
            startTime: data.startTime,
            currentQuestionIndex: data.questionIndex
        } : null);
    }, []));

    useSocketEvent(SOCKET_EVENTS.PLAYER_ANSWERED, useCallback((data: { userId: string; hasAnswered: boolean }) => {
        console.log('✅ Player answered:', data);
        // Mettre à jour l'interface pour montrer que le joueur a répondu
    }, []));

    useSocketEvent(SOCKET_EVENTS.ALL_ANSWERED, useCallback((data: { questionIndex: number }) => {
        console.log('🎯 All players answered:', data);
    }, []));

    useSocketEvent(SOCKET_EVENTS.NEW_QUESTION, useCallback((data: { questionIndex: number; startTime: Date }) => {
        console.log('❓ New question:', data);
        setGameRoom(prev => prev ? {
            ...prev,
            currentQuestionIndex: data.questionIndex,
            questionStartTime: data.startTime
        } : null);
    }, []));

    useSocketEvent(SOCKET_EVENTS.GAME_ENDED, useCallback((data: { results: any[] }) => {
        console.log('🏁 Game ended:', data);
        setGameRoom(prev => prev ? {
            ...prev,
            gameState: 'ended',
            finalResults: data.results
        } : null);
    }, []));

    useSocketEvent(SOCKET_EVENTS.ERROR, useCallback((data: { message: string }) => {
        console.error('⚠️ Game error:', data);
        setError(data.message);
        setIsLoading(false);
    }, []));

    // Calculer le joueur actuel et si c'est l'hôte
    const currentPlayer = gameRoom?.players.find(p => p.userId === userId) || null;
    const isHost = currentPlayer?.isHost || false;

    return {
        gameRoom,
        isLoading,
        error,
        joinGame,
        startGame,
        submitAnswer,
        nextQuestion,
        currentPlayer,
        isHost
    };
}
