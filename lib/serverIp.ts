
// Configuration de l'URL du serveur basée sur l'environnement
// Pour utiliser la production, définir NEXT_PUBLIC_API_URL dans .env.local
// Sinon, utiliser localhost par défaut en développement
export const serverIp =
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:8000/api/v1';

// URL de base pour les WebSockets (retire /api/v1)
export const getServerBaseUrl = (apiUrl: string): string => {
    return apiUrl.replace(/\/api\/v1$/, '');
};