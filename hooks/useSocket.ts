import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import socketService from '@/lib/socket';
import { SOCKET_EVENTS } from '@/lib/config';

/**
 * Hook React pour utiliser Socket.IO dans les composants
 */
export function useSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connexion au socket
        const socket = socketService.connect();
        socketRef.current = socket;

        // Handlers de connexion
        const handleConnect = () => {
            console.log('🟢 useSocket: Connected');
            setIsConnected(true);
            setError(null);
        };

        const handleDisconnect = () => {
            console.log('🔴 useSocket: Disconnected');
            setIsConnected(false);
        };

        const handleError = (err: any) => {
            console.error('❌ useSocket: Error', err);
            setError(err?.message || 'Connection error');
            setIsConnected(false);
        };

        // Écouter les événements
        socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
        socket.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
        socket.on(SOCKET_EVENTS.CONNECT_ERROR, handleError);

        // Cleanup
        return () => {
            socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
            socket.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
            socket.off(SOCKET_EVENTS.CONNECT_ERROR, handleError);
            // Ne pas déconnecter complètement pour permettre la réutilisation
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        error,
    };
}

/**
 * Hook pour écouter un événement socket spécifique
 */
export function useSocketEvent(event: string, callback: (...args: any[]) => void) {
    const socket = socketService.getSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on(event, callback);

        return () => {
            socket.off(event, callback);
        };
    }, [socket, event, callback]);
}
