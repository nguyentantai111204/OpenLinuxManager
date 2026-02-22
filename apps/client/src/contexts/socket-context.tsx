import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SystemStats {
    cpu: number;
    ram_total: number; // in bytes
    ram_used: number; // in bytes
    ram_free: number; // in bytes
    uptime: number;
    os_name: string;
    os_version: string;
    os_pretty_name: string;
    timestamp: number;
    error?: string;
}

export interface SystemProcess {
    pid: number;
    name: string;
    user: string;
    status: string;
    cpu: number;
    memory: number; // in MB
}

export interface StorageData {
    total: number; // in GB
    used: number; // in GB
    free: number; // in GB
    partitions: {
        name: string;
        mountPoint: string;
        type: string;
        size: string;
        used: string;
        avail: string;
        usePercent: number;
    }[];
}

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
            console.log('Received systemStats:', data);
            setSystemStats(data);
        });

        // Listen for processes
        socketInstance.on('systemProcesses', (data: SystemProcess[]) => {
            setProcesses(data);
        });

        // Listen for storage
        socketInstance.on('systemStorage', (data: StorageData) => {
            setStorage(data);
        });

        setSocket(socketInstance);

        // Cleanup on app unmount (only when entire app closes)
        return () => {
            console.log('🔌 Disconnecting socket on app unmount');
            socketInstance.disconnect();
        };
    }, []); // Empty dependency array - only run once

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
