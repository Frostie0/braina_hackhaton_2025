/**
 * Configuration centralisée de l'application
 */

// URLs du backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';

// Routes API
export const API_ROUTES = {
    user: {
        login: '/api/v1/user/login',
        register: '/api/v1/user/register',
    },
    quiz: {
        list: '/api/v1/quiz',
        create: '/api/v1/quiz/create',
        get: (id: string) => `/api/v1/quiz/${id}`,
    },
    game: {
        create: '/api/v1/game/create',
        join: '/api/v1/game/join',
        status: (gameCode: string) => `/api/v1/game/${gameCode}`,
    }
};

// WebSocket événements
export const SOCKET_EVENTS = {
    // Client -> Server
    JOIN_GAME: 'join_game',
    START_GAME: 'start_game',
    SUBMIT_ANSWER: 'submit_answer',
    NEXT_QUESTION: 'next_question',

    // Server -> Client
    PLAYER_JOINED: 'player_joined',
    GAME_STATE: 'game_state',
    GAME_STARTED: 'game_started',
    PLAYER_ANSWERED: 'player_answered',
    ALL_ANSWERED: 'all_answered',
    NEW_QUESTION: 'new_question',
    GAME_ENDED: 'game_ended',
    ERROR: 'error',

    // Connexion
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',
};

// Constantes de jeu
export const GAME_CONSTANTS = {
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 10,
    DEFAULT_TIME_PER_QUESTION: 15,
    MIN_QUESTIONS: 1,
    MAX_QUESTIONS: 50,
};
