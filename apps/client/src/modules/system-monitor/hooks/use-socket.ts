import { useEffect, useState } from 'react';
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

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
    const [processes, setProcesses] = useState<SystemProcess[]>([]);
    const [storage, setStorage] = useState<StorageData | null>(null);
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

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return {
        socket,
        systemStats,
        processes,
        storage,
        isConnected,
    };
}
