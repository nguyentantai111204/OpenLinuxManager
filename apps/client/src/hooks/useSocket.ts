import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SystemStats {
    cpu: number;
    ram_total: number;
    ram_used: number;
    ram_free: number;
    uptime: number;
    os_name: string;
    os_version: string;
    os_pretty_name: string;
    timestamp: number;
    error?: string;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Create socket connection
        const socketInstance = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });

        // Connection event handlers
        socketInstance.on('connect', () => {
            console.log('✅ Socket connected');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setIsConnected(false);
        });

        // Listen for system stats
        socketInstance.on('systemStats', (data: SystemStats) => {
            setSystemStats(data);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return {
        socket,
        systemStats,
        isConnected,
    };
}
