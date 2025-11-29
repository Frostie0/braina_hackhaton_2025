/**
 * Service de gestion du stockage des informations utilisateur
 * Utilise localStorage pour le web (Next.js)
 */

export interface UserData {
    userId: string;
    name: string;
    email: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

/**
 * Sauvegarder les informations de l'utilisateur dans localStorage
 */
export const saveUserData = (userData: UserData): void => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('userId', userData.userId);
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ Données utilisateur sauvegardées:', userData);
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des données utilisateur:', error);
        }
    }
};

/**
 * Sauvegarder les tokens d'authentification
 */
export const saveAuthTokens = (tokens: AuthTokens): void => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('access_token', tokens.access_token);
            localStorage.setItem('refresh_token', tokens.refresh_token);
            console.log('✅ Tokens sauvegardés');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des tokens:', error);
        }
    }
};

/**
 * Récupérer les informations de l'utilisateur depuis localStorage
 */
export const getUserData = (): UserData | null => {
    if (typeof window !== 'undefined') {
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                return JSON.parse(userJson) as UserData;
            }
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des données utilisateur:', error);
        }
    }
    return null;
};

/**
 * Récupérer l'ID de l'utilisateur
 */
export const getUserId = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userId');
    }
    return null;
};

/**
 * Récupérer le nom de l'utilisateur
 */
export const getUserName = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userName');
    }
    return null;
};

/**
 * Récupérer l'email de l'utilisateur
 */
export const getUserEmail = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userEmail');
    }
    return null;
};

/**
 * Vérifier si l'utilisateur est connecté
 */
export const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('userId');
        return !!(token && userId);
    }
    return false;
};

/**
 * Déconnecter l'utilisateur (supprimer toutes les données)
 */
export const clearUserData = (): void => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            console.log('✅ Données utilisateur supprimées');
        } catch (error) {
            console.error('❌ Erreur lors de la suppression des données utilisateur:', error);
        }
    }
};
