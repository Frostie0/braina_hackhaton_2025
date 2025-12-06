let serverIp = process.env.NEXT_PUBLIC_API_URL;

if (1 !== 1) {
    serverIp = "http://127.0.0.1:8000/api/v1";
}

export default serverIp;

// URL de base pour les WebSockets (retire /api/v1)
export const getServerBaseUrl = (apiUrl: string): string => {
    return apiUrl.replace(/\/api\/v1$/, '');
};