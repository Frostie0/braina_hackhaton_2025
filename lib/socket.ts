import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, SOCKET_EVENTS } from './config';

/**
 * Service singleton pour gérer la connexion Socket.IO
 */
class SocketService {
    private socket: Socket | null = null;
    private isConnected: boolean = false;

    /**
     * Initialise et retourne la connexion socket
     */
    connect(): Socket {
        if (this.socket && this.isConnected) {
            return this.socket;
        }

        console.log('🔌 Connecting to socket server:', SOCKET_URL);

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        // Événements de connexion
        this.socket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log('✅ Socket connected:', this.socket?.id);
            this.isConnected = true;
        });

        this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            console.log('❌ Socket disconnected:', reason);
            this.isConnected = false;
        });

        this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
            console.error('🔴 Socket connection error:', error);
            this.isConnected = false;
        });

        return this.socket;
    }

    /**
     * Déconnecte le socket
     */
    disconnect(): void {
        if (this.socket) {
            console.log('🔌 Disconnecting socket...');
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    /**
     * Retourne l'instance socket actuelle
     */
    getSocket(): Socket | null {
        return this.socket;
    }

    /**
     * Vérifie si le socket est connecté
     */
    isSocketConnected(): boolean {
        return this.isConnected && this.socket !== null && this.socket.connected;
    }

    /**
     * Émet un événement
     */
    emit(event: string, data?: any): void {
        if (this.socket && this.isConnected) {
            this.socket.emit(event, data);
        } else {
            console.warn('⚠️ Cannot emit - socket not connected');
        }
    }

    /**
     * Écoute un événement
     */
    on(event: string, callback: (...args: any[]) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    /**
     * Arrête d'écouter un événement
     */
    off(event: string, callback?: (...args: any[]) => void): void {
        if (this.socket) {
            if (callback) {
                this.socket.off(event, callback);
            } else {
                this.socket.off(event);
            }
        }
    }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
