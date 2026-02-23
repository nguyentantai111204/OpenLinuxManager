import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { SystemStats, SystemProcess, StorageData } from '../types/socket.types';

export type { SystemStats, SystemProcess, StorageData };

interface SocketContextType {
    socket: Socket | null;
    systemStats: SystemStats | null;
    processes: SystemProcess[];
    storage: StorageData | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within SocketProvider');
    }
    return context;
};

interface SocketProviderProps {
    children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
    const [processes, setProcesses] = useState<SystemProcess[]>([]);
    const [storage, setStorage] = useState<StorageData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Use relative path ('') so the connection goes through Vite's /socket.io proxy.
        // Direct cross-port connections (localhost:4200 → ws://localhost:3000) are
        // blocked by browsers; routing through the Vite proxy on the same port fixes this.
        const socketInstance = io('', {
            transports: ['websocket', 'polling'],
        });

        socketInstance.on('connect', () => setIsConnected(true));
        socketInstance.on('disconnect', () => setIsConnected(false));

        socketInstance.on('systemStats', (data: SystemStats) => setSystemStats(data));
        socketInstance.on('systemProcesses', (data: SystemProcess[]) => setProcesses(data));
        socketInstance.on('systemStorage', (data: StorageData) => setStorage(data));

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const contextValue = useMemo(
        () => ({
            socket,
            systemStats,
            processes,
            storage,
            isConnected,
        }),
        [socket, systemStats, processes, storage, isConnected]
    );

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
}
